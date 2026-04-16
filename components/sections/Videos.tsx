import { fetchPlaylistVideos } from '@/lib/youtube';
import { Play } from 'lucide-react';

export default async function Videos() {
  const videos = await fetchPlaylistVideos(3);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-medium text-terra-600 tracking-wide uppercase">
            No YouTube
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-terra-900 mt-3 mb-4">
            Últimos vídeos do canal
          </h2>
          <p className="text-terra-700">
            Atualizado automaticamente a cada novo vídeo publicado.
          </p>
        </div>

        {videos.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-terra-100 aspect-video block"
              >
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={28} className="text-terra-700 ml-1" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-terra-50 rounded-2xl">
            <p className="text-terra-700">Carregando vídeos do canal...</p>
          </div>
        )}

        <div className="text-center mt-12">
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
      </div>
    </section>
  );
}
