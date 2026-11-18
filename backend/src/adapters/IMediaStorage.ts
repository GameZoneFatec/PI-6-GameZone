/** Onde ficam as imagens dos jogos (capas enviadas pelo backoffice). */
export interface IMediaStorage {
    /** Salva a imagem e devolve o caminho relativo (ex.: games/zelda/cover-123.jpg). */
    save(relativeDir: string, fileBaseName: string, data: Buffer, ext: 'jpg' | 'png' | 'webp'): Promise<string>;
    remove(relativePath: string): Promise<void>;
}
