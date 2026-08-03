/**
 * ═══════════════════════════════════════════════════════════════
 *  RAM EDITZ — YOUR VIDEOS (edit this file only)
 * ═══════════════════════════════════════════════════════════════
 *
 * HOW TO ADD A VIDEO:
 *   Copy any block below, paste it in the portfolio array, fill in details.
 *
 * HOW TO REMOVE A VIDEO:
 *   Delete its entire { ... } block from the portfolio array
 *   OR set enabled: false to hide it without deleting.
 *
 * URL FORMATS (use any one):
 *   YouTube:  https://www.youtube.com/watch?v=VIDEO_ID
 *   YouTube:  https://youtu.be/VIDEO_ID
 *   YouTube:  https://www.youtube.com/embed/VIDEO_ID
 *   MP4 file: videos/my-reel.mp4  (put file in /videos folder)
 *   Cloudinary: paste your upload URL as-is — q_auto / f_auto is applied automatically
 *   Vimeo:    https://vimeo.com/123456789
 *
 * THUMBNAIL (optional):
 *   Leave empty → auto thumbnail from YouTube/Vimeo
 *   Or set:    thumbnail: 'assets/thumbs/my-video.jpg'
 *
 * CATEGORIES (for filters):
 *   FASHION | MUSIC | CULTURE | TECHNOLOGY | NARRATIVE | LIVE | COMMERCIAL | OTHER
 */

window.RAM_EDITZ_VIDEOS = {

  /* ── Featured showreel (top of Portfolio page) ── */
  featured: {
    enabled: true,
    title: 'Video Editing for Social Media',
    url: 'https://res.cloudinary.com/dekwcqwij/video/upload/v1781455503/portfolio_videos/hgrtpgnkctcqmeweubcy.mp4',
    thumbnail: 'assets/thumbs/social-media-hero.jpg'
  },

  /* ── Portfolio grid — add / remove / edit videos below ── */
  portfolio: [

    {
      id: 'simple-clean-15s',
      enabled: true,
      title: '15 Seconds Simple and Clean',
      category: 'COMMERCIAL',
      url: 'https://res.cloudinary.com/dekwcqwij/video/upload/v1781416403/portfolio_videos/j2jntefmfwex4wnbdnpo.mp4',
      thumbnail: 'assets/thumbs/simple-clean-15s.jpg'
    },

    {
      id: 'life-of-video-editor',
      enabled: true,
      title: 'The Life of Video Editor',
      category: 'NARRATIVE',
      url: 'https://res.cloudinary.com/dekwcqwij/video/upload/v1781416405/portfolio_videos/v7tq6qxqz5ntwvgo34ed.mp4',
      thumbnail: 'assets/thumbs/june-2026-reel.jpg'
    },

    {
      id: 'urban-pulse',
      enabled: true,
      title: "Documentary — 'Urban Pulse'",
      category: 'CULTURE',
      url: 'https://res.cloudinary.com/dekwcqwij/video/upload/v1781416412/portfolio_videos/wip7ddktzkn6duuv8dmc.mp4',
      thumbnail: 'assets/thumbs/urban-pulse.jpg'
    },

    {
      id: 'text-animation',
      enabled: true,
      title: 'Text Animation',
      category: 'COMMERCIAL',
      url: 'https://res.cloudinary.com/dekwcqwij/video/upload/v1781416414/portfolio_videos/tlhyqhbhsteyt3axmsm1.mp4',
      thumbnail: 'assets/thumbs/text-animation.jpg'
    },

    {
      id: 'aarva-ad',
      enabled: true,
      title: 'Aarva Ad',
      category: 'COMMERCIAL',
      url: 'https://res.cloudinary.com/dekwcqwij/video/upload/v1781416416/portfolio_videos/r5njpp8kukmoxl6fjp4c.mp4',
      thumbnail: 'assets/thumbs/aarva-ad.jpg'
    },
    {
  id: 'the-real-conversation',
  enabled: true,
  title: 'The Real Conversation',
  category: 'NARRATIVE',
  url: 'https://res.cloudinary.com/dekwcqwij/video/upload/portfolio_videos/tmw384m273nusccfwsqz.mp4',
  thumbnail: ''
},

{
  id: 'behind-the-story',
  enabled: true,
  title: 'Behind the Story',
  category: 'NARRATIVE',
  url: 'https://res.cloudinary.com/dekwcqwij/video/upload/portfolio_videos/lt2om24yquik20sxjeu6.mp4',
  thumbnail: ''
},

{
  id: 'voices-that-matter',
  enabled: true,
  title: 'Voices That Matter',
  category: 'NARRATIVE',
  url: 'https://res.cloudinary.com/dekwcqwij/video/upload/portfolio_videos/rcbke5hit5adq0faocy3.mp4',
  thumbnail: ''
},

{
  id: 'the-next-chapter',
  enabled: true,
  title: 'The Next Chapter',
  category: 'NARRATIVE',
  url: 'https://res.cloudinary.com/dekwcqwij/video/upload/portfolio_videos/iot1lqob912wrkvb0yfh.mp4',
  thumbnail: ''
}
  ]
};
