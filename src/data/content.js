
export const sections = [
  // 1. HERO - Cover with photo-18 inline
  {
    id: 'cover',
    type: 'cover',
    pageType: 'cover',
    chapter: '',
    sticky: '',
    scrubber: '',
    gray: true,
    verticalCenter: true,
    coverPhoto: 18, // photo-18 will be rendered inline
    title: 'Make Something Wonderful',
    subtitle: 'Steve Jobs in his own words'
  },

  // 2. QUOTE - Opening quote (gray background)
  {
    id: 'quote-section',
    type: 'quote',
    pageType: 'text',
    chapter: '',
    gray: true,
    verticalCenter: true,
    paragraphs: [
      "There's lots of ways to be, as a person. And some people express their deep appreciation in different ways. But one of the ways that I believe people express their appreciation to the rest of humanity is to make something wonderful and put it out there.",
      "And you never meet the people. You never shake their hands. You never hear their story or tell yours. But somehow, in the act of making something with a great deal of care and love, something's transmitted there. And it's a way of expressing to the rest of our species our deep appreciation. So we need to be true to who we are and remember what's really important to us.",
      "—Steve, 2007"
    ]
  },

  // 3. INTRODUCTION - Laurene Powell Jobs
  {
    id: 'introduction',
    type: 'text',
    pageType: 'text',
    chapter: 'Intro',
    sticky: 'Intro',
    scrubber: 'Intro',
    title: 'Introduction by\nLaurene Powell Jobs',
    paragraphs: [
      "The best way to understand a person is to listen to that person directly. And the best way to understand Steve is to listen to what he said and wrote over the course of his life. His words—in speeches, interviews, and emails—offer a window into how he thought. And he was an exquisite thinker.",
      "Much of what's in these pages reflects guiding themes of Steve's life: his sense of the worlds that would emerge from marrying the arts and technology; his unbelievable rigor, which he imposed first and most strenuously on himself; his tenacity in pursuit of assembling and leading great teams; and perhaps, above all, his insights into what it means to be human.",
      "Steve once told a group of students, \"You appear, have a chance to blaze in the sky, then you disappear.\" He gave an extraordinary amount of thought to how best to use our fleeting time. He was compelled by the notion of being part of the arc of human existence, animated by the thought that he—or that any of us—might elevate or expedite human progress.",
      "It is hard enough to see what is already there, to gain a clear view. Steve's gift was greater still: he saw clearly what was not there, what could be there, what had to be there. His mind was never a captive of reality. Quite the contrary: he imagined what reality lacked and set out to remedy it. His ideas were not arguments, but intuitions, born of a true inner freedom and an epic sense of possibility.",
      "In these pages, Steve drafts and refines. He stumbles, grows, and changes. But always, always, he retains that sense of possibility. I hope these selections ignite in you the understanding that drove him: that everything that makes up what we call life was made by people no smarter, no more capable, than we are; that our world is not fixed—and so we can change it for the better."
    ]
  },

  // 4. TITLE PAGE - Blue background
  {
    id: 'title-page',
    type: 'title',
    pageType: 'title',
    chapter: 'Intro',
    blue: true,
    titlePage: true,
    title: 'Edited by Leslie Berlin',
    subtitle: 'Published by the Steve Jobs Archive',
    paragraphs: [
      "Contents have been edited and excerpted for clarity and privacy.",
      "✂ indicates that several sentences or paragraphs have been removed from the original."
    ]
  },

  // 5. IMAGE PAGE - Young Steve photo
  {
    id: 'image-page-1',
    type: 'image',
    pageType: 'image',
    chapter: 'Intro',
    black: true,
    images: [
      {
        photoNumber: 2,
        alt: 'Young Steve on a tricycle',
        caption: 'Steve at two. He later called computers "a bicycle of the mind."',
        portrait: true
      }
    ]
  },

  // 6. PREFACE - Steve's Childhood
  {
    id: 'preface',
    type: 'text',
    pageType: 'text',
    chapter: 'Preface',
    sticky: 'Preface',
    scrubber: 'Preface',
    title: 'Preface: Steve on His Childhood and Young Adulthood',
    subtitles: [
      "Steve typically kept his personal life private, but he did occasionally talk about growing up in the San Francisco Bay Area. It was a time when engineers and programmers began flooding into what came to be known as Silicon Valley.",
      "In 1995, he recorded an oral history for the Smithsonian."
    ],
    paragraphs: [
      "I was very lucky. I had a father, named Paul, who was a pretty remarkable man. He never graduated from high school. He joined the Coast Guard in World War II and ferried troops around the world for General Patton, and I think he was always getting into trouble and getting busted down to Private. He was a machinist by trade and worked very hard and was kind of a genius with his hands.",
      "He had a workbench out in the garage where, when I was about five or six, he sectioned off a little piece of it and said, 'Steve, this is your workbench now.' And he gave me some of his smaller tools and showed me how to use a hammer and saw and how to build things. It really was very good for me. He spent a lot of time with me, teaching me how to build things, take things apart, put things back together.",
      "One of the things that he touched upon was electronics. He did not have a deep understanding of electronics himself, but he'd encountered electronics a lot in automobiles and other things that he would fix. He showed me the rudiments of electronics, and I got very interested in that."
    ]
  },

  // 7. PART I - 1976-1985
  {
    id: 'part-1',
    type: 'part',
    pageType: 'part',
    chapter: '1976–1985',
    sticky: '1976–1985',
    scrubber: '1976–1985',
    blue: true,
    title: 'Part I, 1976–1985',
    subtitle: '"A lot of people put a lot of love into this."'
  },

  // 8. IMAGE SECTION - Early Apple innovation
  {
    id: 'image-page-2',
    type: 'image',
    pageType: 'image',
    chapter: '1976–1985',
    black: true,
    images: [
      {
        photoNumber: 64,
        alt: 'Early Apple computer',
        caption: 'The journey of innovation begins with simple ideas.',
        portrait: false
      }
    ]
  },

  // 9. PART I CONTENT - Editor's Note and Steve on Launching Apple
  {
    id: 'part-1-note',
    type: 'text',
    pageType: 'text',
    chapter: '1976–1985',
    narration: [
      "In 1976, when Steve and his friend Steve Wozniak (\"Woz\") began building computers in Steve's childhood home, personal computers barely existed. Engineers worked on huge mainframe systems. Hobbyists who wanted their own computers had to build machines that they could program themselves.",
      "When Apple launched, Steve was twenty-one, precocious but largely unformed. His name recognition was negligible, his wealth nonexistent. Within five years, he graced the cover of Time. By the end of the decade, before he turned thirty, he was the public face of a Fortune 500 company."
    ],
    title: 'Steve on Launching Apple',
    subtitles: [
      "In 1984, Steve recalled the friendships behind Apple."
    ],
    paragraphs: [
      "I met Woz when I was thirteen in a friend of mine's garage. He was, I think, eighteen, maybe nineteen at that time, in college. And he was one of those electronics kids. We started talking about electronics and music and many other things, and we became very good friends. It was really remarkable. There was never any competition because he was so much older and better at everything than I was, but I looked up to him, and we became extremely good friends and did projects together that we probably never would have done alone. Because of this unique friendship, it was possible to do those things that neither of us would have been capable of individually."
    ]
  },
  
  // 10. IMAGE SECTION - Steve at work
  {
    id: 'image-page-3',
    type: 'image',
    pageType: 'image',
    chapter: '1976–1985',
    black: true,
    images: [
      {
        photoNumber: 6,
        alt: 'Steve at work',
        caption: 'Dedication to craft and vision.',
        portrait: true
      }
    ]
  },
  
  // 11. CREDITS - Final page
  {
    id: 'credits',
    type: 'text',
    pageType: 'text',
    chapter: 'Credits',
    sticky: 'Credits',
    scrubber: 'Credits',
    gray: true,
    verticalCenter: true,
    title: 'Credits',
    paragraphs: [
      "This archive is a tribute to Steve Jobs and his extraordinary legacy.",
      "Created with care to honor his vision of making something wonderful.",
      "© 2025 Steve Jobs Archive. All rights reserved."
    ]
  }
];

export const TOTAL_SECTIONS = sections.length;

export const SECTION_COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  gray: '#f5f5f7',
  blue: '#0071E3',
};

// Chapter labels for scrub scroller
export const CHAPTER_LABELS = [
  { id: 0, label: '', display: false },
  { id: 1, label: 'Intro', display: true },
  { id: 2, label: 'Preface', display: true },
  { id: 3, label: '1976–1985', display: true },
  { id: 4, label: '1985–1996', display: true },
  { id: 5, label: '1996–2011', display: true },
  { id: 6, label: 'Events', display: true },
  { id: 7, label: 'Credits', display: true }
];
