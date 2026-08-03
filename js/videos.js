/**
 * ═══════════════════════════════════════════════════════════════
 *  RAM EDITZ — YOUR VIDEOS
 * ═══════════════════════════════════════════════════════════════
 *
 * HOME PAGE:
 *   Only the NEW videos are used for featured content.
 *
 * PORTFOLIO PAGE:
 *   OLD + NEW videos are displayed.
 *
 * ═══════════════════════════════════════════════════════════════
 */

window.RAM_EDITZ_VIDEOS = {

  /* ═══════════════════════════════════════════════════════════
     HOME PAGE — FEATURED VIDEO
     ═══════════════════════════════════════════════════════════ */

  featured: {
    enabled: true,
    title: 'The Real Conversation',
    url: 'https://res.cloudinary.com/dekwcqwij/video/upload/portfolio_videos/tmw384m273nusccfwsqz.mp4',
    thumbnail: ''
  },


  /* ═══════════════════════════════════════════════════════════
     PORTFOLIO PAGE
     OLD VIDEOS + NEW VIDEOS
     ═══════════════════════════════════════════════════════════ */

  portfolio: [

    /* ─────────────────────────────────────────────────────────
       OLD VIDEOS
       ───────────────────────────────────────────────────────── */

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


    /* ─────────────────────────────────────────────────────────
       NEW VIDEOS
       ───────────────────────────────────────────────────────── */

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
    }

  ]
};
