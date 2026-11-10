import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'node:crypto';

// archivo recibido en memoria (multer). solo los campos que usamos
export interface ArchivoSubido {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class AlmacenamientoService {
  private readonly logger = new Logger(AlmacenamientoService.name);

  constructor(private readonly config: ConfigService) {}

  // sube una imagen a cloudinary y devuelve su url https. carpeta: ej 'redsocial/perfiles'
  async subirImagen(archivo: ArchivoSubido, carpeta: string): Promise<string> {
    const nombreCloud = this.config.getOrThrow<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.config.getOrThrow<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.config.getOrThrow<string>('CLOUDINARY_API_SECRET');

    // firma: parametros ordenados alfabeticamente + el secreto, con sha-1.
    // cloudinary recalcula la firma del otro lado: el secreto nunca viaja
    const timestamp = Math.round(Date.now() / 1000).toString();
    const firma = createHash('sha1')
      .update(`folder=${carpeta}&timestamp=${timestamp}${apiSecret}`)
      .digest('hex');

    const formulario = new FormData();
    formulario.append('file', new Blob([new Uint8Array(archivo.buffer)], { type: archivo.mimetype }), archivo.originalname);
    formulario.append('api_key', apiKey);
    formulario.append('timestamp', timestamp);
    formulario.append('folder', carpeta);
    formulario.append('signature', firma);

    const respuesta = await fetch(`https://api.cloudinary.com/v1_1/${nombreCloud}/image/upload`, {
      method: 'POST',
      body: formulario,
    }).catch(() => null);

    if (!respuesta) {
      throw new BadGatewayException('No se pudo conectar con el servicio de imágenes.');
    }
    if (!respuesta.ok) {
      // el detalle va a la terminal del servidor, no al cliente
      this.logger.error(`Cloudinary respondió ${respuesta.status}: ${await respuesta.text()}`);
      throw new BadGatewayException('El servicio de imágenes rechazó la subida.');
    }

    const datos = (await respuesta.json()) as { secure_url?: string };
    if (!datos.secure_url) {
      throw new BadGatewayException('El servicio de imágenes no devolvió la dirección de la imagen.');
    }
    return datos.secure_url;
  }
}