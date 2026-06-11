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
    title: 'Ram editz Showreel 2024',
    url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    thumbnail: ''
  },

  /* ── Portfolio grid — add / remove / edit videos below ── */
  portfolio: [

    {
      id: 'simple-clean-15s',
      enabled: true,
      title: '15 Seconds Simple and Clean',
      category: 'COMMERCIAL',
      url: 'videos/15-seconds-simple-and-clean.mp4',
      thumbnail: 'assets/thumbs/simple-clean-15s.jpg'
    },

    {
      id: 'life-of-video-editor',
      enabled: true,
      title: 'The Life of Video Editor',
      category: 'NARRATIVE',
      url: 'videos/lv_0_20260611164922.mp4',
      thumbnail: 'assets/thumbs/june-2026-reel.jpg'
    },

    {
      id: 'urban-pulse',
      enabled: true,
      title: "Documentary — 'Urban Pulse'",
      category: 'CULTURE',
      url: 'videos/lv_0_20260517115221.mp4',
      thumbnail: 'assets/thumbs/urban-pulse.jpg'
    },

    {
      id: 'text-animation',
      enabled: true,
      title: 'Text Animation',
      category: 'COMMERCIAL',
      url: 'videos/text-animation.mp4',
      thumbnail: 'assets/thumbs/text-animation.jpg'
    },

    {
      id: 'aarva-ad',
      enabled: true,
      title: 'Aarva Ad',
      category: 'COMMERCIAL',
      url: 'videos/aarva-ad.mp4',
      thumbnail: 'assets/thumbs/aarva-ad.jpg'
    }
  ]
};
