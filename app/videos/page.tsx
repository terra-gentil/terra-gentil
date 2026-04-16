import type { Metadata } from 'next';
import { fetchPlaylistVideos } from '@/lib/youtube';
import { Play } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Vídeos — Terra Gentil',
  description: 'Assista a todos os vídeos do canal Terra Gentil no YouTube.',
};

export const revalidate = 3600;

export default async function VideosPage() {
  const videos = await fetchPlaylistVideos();

  return (
    <>
      <section className="bg-gradient-to-br from-terra-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-terra-900 mb-4">Vídeos</h1>
          <p className="text-terra-700 text-lg">
            Todos os vídeos do canal, atualizados automaticamente.
          </p>
          {videos.length > 0 && (
            <p className="text-sm text-terra-600 mt-3">
              {videos.length} {videos.length === 1 ? 'vídeo' : 'vídeos'} disponíveis
            </p>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {videos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="space-y-3">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-terra-100 shadow-md">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <div className="px-2">
                    <h3 className="font-bold text-terra-800 line-clamp-2">{video.title}</h3>
                    {video.publishedAt && (
                      <time className="text-xs text-terra-600 mt-1 block">
                        {new Date(video.publishedAt).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </time>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-terra-50 rounded-3xl">
              <p className="text-terra-700 mb-4">
                Não foi possível carregar os vídeos agora. Tente recarregar a página.
              </p>
              <a
                href="https://www.youtube.com/@TerraGentil"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition"
              >
                <Play size={18} fill="currentColor" />
                Ir direto para o canal
              </a>
            </div>
          )}

          {videos.length > 0 && (
            <div className="text-center mt-16">
              <a
                href="https://www.youtube.com/@TerraGentil"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-all hover:scale-105"
              >
                <Play size={18} fill="currentColor" />
                Inscreva-se no canal
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
