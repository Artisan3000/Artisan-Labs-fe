export type MockReview = {
  name: string;
  rating: number;
  comment: string;
};

export const mockReviewsByProductHandle: Record<string, MockReview[]> = {
  "2-in-1-beard-mustache-comb-7-5-tortoiseshell": [
    {
      name: "Marcus L.",
      rating: 5,
      comment: "Solid pocket comb with a polished feel. It keeps my beard neat without pulling.",
    },
    {
      name: "Evan R.",
      rating: 4,
      comment: "Great for mustache cleanup and travel. The tortoiseshell finish looks sharp.",
    },
  ],
  "30-proof-styling-cream-1": [
    {
      name: "Julian M.",
      rating: 5,
      comment: "Light hold, no crunch, and easy to restyle later in the day.",
    },
    {
      name: "Chris P.",
      rating: 5,
      comment: "Exactly what I needed for a natural finish after towel drying.",
    },
    {
      name: "Andre S.",
      rating: 4,
      comment: "Good daily cream. Works best for me when I use a small amount.",
    },
  ],
  "40-proof-sea-salt-spray": [
    {
      name: "Nate C.",
      rating: 5,
      comment: "Adds texture without making my hair feel dirty or dry.",
    },
    {
      name: "Leo B.",
      rating: 4,
      comment: "Nice beachy finish. I use it before blow drying for extra volume.",
    },
    {
      name: "Sam T.",
      rating: 5,
      comment: "One of the better salt sprays I have tried. The hold is subtle but useful.",
    },
  ],
  "members-only-work-shirt": [
    {
      name: "Dylan K.",
      rating: 5,
      comment: "Great fit and weight. Feels like something from the shop, not generic merch.",
    },
    {
      name: "Owen J.",
      rating: 4,
      comment: "Clean design and easy to layer. Runs a little roomy, which I like.",
    },
  ],
  "local-shops-global-tee": [
    {
      name: "Mason A.",
      rating: 5,
      comment: "Soft tee with a strong graphic. Got compliments the first time I wore it.",
    },
    {
      name: "Victor G.",
      rating: 5,
      comment: "Good everyday shirt. The print feels durable after a few washes.",
    },
  ],
  "local-shops-worldwide-work-shirt": [
    {
      name: "Anthony R.",
      rating: 5,
      comment: "Feels like a proper work shirt. Structured, clean, and easy to wear open.",
    },
    {
      name: "Noah F.",
      rating: 4,
      comment: "Nice heavier fabric and the branding is subtle enough for regular wear.",
    },
  ],
  "acetate-beard-afro-pick-3-5": [
    {
      name: "Jamal W.",
      rating: 5,
      comment: "Small but sturdy. Perfect for shaping my beard before heading out.",
    },
    {
      name: "Miles D.",
      rating: 4,
      comment: "Good quality pick and easy to keep in a dopp kit.",
    },
  ],
  "acetate-mustache-comb-3-tortoiseshell": [
    {
      name: "Henry C.",
      rating: 5,
      comment: "Tiny but useful. It keeps my mustache tidy without scratching.",
    },
    {
      name: "Peter N.",
      rating: 4,
      comment: "Looks good and does the job. Nice upgrade from a plastic comb.",
    },
  ],
  "advanced-volumizing-foam": [
    {
      name: "Rafael Q.",
      rating: 5,
      comment: "Adds lift without feeling sticky. Great before blow drying.",
    },
    {
      name: "Ben H.",
      rating: 4,
      comment: "Gives my fine hair more body and still feels lightweight.",
    },
    {
      name: "Theo M.",
      rating: 5,
      comment: "The volume lasts most of the day. Easy to work through damp hair.",
    },
  ],
  "all-purpose-pomade-1": [
    {
      name: "Daniel E.",
      rating: 5,
      comment: "Reliable hold and not too shiny. Good for my everyday side part.",
    },
    {
      name: "Isaac B.",
      rating: 4,
      comment: "Easy to wash out and strong enough for a clean finish.",
    },
    {
      name: "Cole S.",
      rating: 5,
      comment: "A little goes a long way. It keeps shape without getting stiff.",
    },
  ],
  "barber-comb": [
    {
      name: "Aaron V.",
      rating: 5,
      comment: "Simple, sturdy, and exactly what I wanted for daily styling.",
    },
    {
      name: "Grant P.",
      rating: 4,
      comment: "Good size and feels better than the cheap combs I had before.",
    },
  ],
  "big-mousse": [
    {
      name: "Sean T.",
      rating: 5,
      comment: "Big volume without a helmet feel. Really good with a blow dryer.",
    },
    {
      name: "Alex D.",
      rating: 5,
      comment: "This gives my hair structure but still leaves it touchable.",
    },
    {
      name: "Miguel F.",
      rating: 4,
      comment: "Works well and smells clean. Best when I start with damp hair.",
    },
  ],
  "cilantro-hair-conditioner": [
    {
      name: "Tyler J.",
      rating: 5,
      comment: "Leaves my hair soft without weighing it down.",
    },
    {
      name: "Gabe M.",
      rating: 4,
      comment: "Fresh scent and good slip. My hair feels cleaner after using it.",
    },
  ],
  "clay-pomade-1": [
    {
      name: "Ryan L.",
      rating: 5,
      comment: "Matte finish with real hold. Great for textured styles.",
    },
    {
      name: "Nick A.",
      rating: 5,
      comment: "Strong enough for thick hair but still easy to break down in my hands.",
    },
    {
      name: "Luis C.",
      rating: 4,
      comment: "Good clay product. I use less than expected and it holds all day.",
    },
  ],
  "cream-pomade": [
    {
      name: "Eli W.",
      rating: 5,
      comment: "Smooth application and a softer finish than my usual pomade.",
    },
    {
      name: "Adam R.",
      rating: 4,
      comment: "Good for relaxed styling. Does not leave my hair greasy.",
    },
  ],
  "equilibrium-shampoo": [
    {
      name: "Jon B.",
      rating: 5,
      comment: "My scalp feels balanced and my hair does not dry out after washing.",
    },
    {
      name: "Caleb N.",
      rating: 4,
      comment: "Clean scent and a good daily shampoo. Feels gentle.",
    },
    {
      name: "Patrick S.",
      rating: 5,
      comment: "Noticeably better than drugstore shampoo. Hair feels light afterward.",
    },
  ],
  "everyday-conditioner": [
    {
      name: "Marco H.",
      rating: 5,
      comment: "Good daily conditioner. Softens my hair without making it flat.",
    },
    {
      name: "Ian G.",
      rating: 4,
      comment: "Works well after shampoo and rinses clean.",
    },
  ],
  "grooming-cream": [
    {
      name: "Trevor C.",
      rating: 5,
      comment: "Perfect low-effort styling product. Adds control without looking styled.",
    },
    {
      name: "Felix M.",
      rating: 5,
      comment: "Great for my medium length cut. Natural finish and easy hold.",
    },
  ],
  "hair-pomade": [
    {
      name: "Matteo R.",
      rating: 5,
      comment: "Classic pomade feel with a clean finish. Holds my hair in place.",
    },
    {
      name: "Jesse K.",
      rating: 4,
      comment: "Nice shine and decent control. Easy enough to rinse out.",
    },
    {
      name: "Brian V.",
      rating: 5,
      comment: "Reliable product for a polished look. I keep coming back to it.",
    },
  ],
  "lemongrass-tea-conditioner-empty-heading": [
    {
      name: "Will F.",
      rating: 5,
      comment: "Fresh scent and leaves my hair soft. Great paired with the shampoo.",
    },
    {
      name: "Drew P.",
      rating: 4,
      comment: "Light conditioner that does not feel heavy. Good everyday option.",
    },
  ],
  "lemongrass-tea-shampoo": [
    {
      name: "Austin L.",
      rating: 5,
      comment: "Smells fresh and cleans without stripping my hair.",
    },
    {
      name: "Shane R.",
      rating: 4,
      comment: "Good lather and a clean finish. Works well for frequent washing.",
    },
  ],
  "peppermint-shampoo": [
    {
      name: "Eric J.",
      rating: 5,
      comment: "Refreshing without being overpowering. My scalp feels great after.",
    },
    {
      name: "Tim C.",
      rating: 5,
      comment: "The peppermint feel is excellent in the morning.",
    },
    {
      name: "Matt S.",
      rating: 4,
      comment: "Clean and cooling. I use it a few times a week.",
    },
  ],
  "revive-body-lotion": [
    {
      name: "Collin M.",
      rating: 5,
      comment: "Absorbs quickly and does not feel greasy. Good after a shower.",
    },
    {
      name: "Spencer D.",
      rating: 4,
      comment: "Light texture and clean scent. Easy daily lotion.",
    },
  ],
  "sage-styling-cream": [
    {
      name: "Hugo B.",
      rating: 5,
      comment: "Soft hold with a really natural finish. Great for longer hair.",
    },
    {
      name: "Max P.",
      rating: 4,
      comment: "Subtle control and no stiffness. Smells understated.",
    },
  ],
  "styling-comb": [
    {
      name: "Kevin A.",
      rating: 5,
      comment: "Good comb for styling after applying product. Feels sturdy.",
    },
    {
      name: "Luke T.",
      rating: 4,
      comment: "Clean design and the teeth work well for my hair length.",
    },
  ],
  "styling-concrete": [
    {
      name: "Oscar B.",
      rating: 5,
      comment: "Strong hold and matte finish. Best product I have used for short textured hair.",
    },
    {
      name: "Dean R.",
      rating: 5,
      comment: "Locks the style in without looking wet. Great for thick hair.",
    },
    {
      name: "Paul N.",
      rating: 4,
      comment: "Very strong hold. I only need a small amount.",
    },
  ],
  "texturizing-paste-1": [
    {
      name: "Jack H.",
      rating: 5,
      comment: "Adds separation and texture without making my hair look greasy.",
    },
    {
      name: "Simon L.",
      rating: 4,
      comment: "Good paste for messy styles. Easy to reshape throughout the day.",
    },
    {
      name: "Vince K.",
      rating: 5,
      comment: "Great control for a natural, lived-in look.",
    },
  ],
  "tompkins-scented-candle": [
    {
      name: "George F.",
      rating: 5,
      comment: "Warm, clean scent that makes the room feel finished.",
    },
    {
      name: "Ethan W.",
      rating: 4,
      comment: "Nice candle with a subtle scent throw. Packaging looks great.",
    },
  ],
  "tranquil-body-cleanser": [
    {
      name: "Rob C.",
      rating: 5,
      comment: "Clean scent and does not dry out my skin.",
    },
    {
      name: "Landon M.",
      rating: 4,
      comment: "Good daily body wash. Feels a little more elevated than usual.",
    },
  ],
  "watermint-gin-daily-face-cleanser": [
    {
      name: "Zach P.",
      rating: 5,
      comment: "Fresh cleanser that leaves my face clean but not tight.",
    },
    {
      name: "Derek S.",
      rating: 5,
      comment: "Great daily face wash. The scent is crisp and light.",
    },
    {
      name: "Ari M.",
      rating: 4,
      comment: "Gentle and effective. Works well after the gym.",
    },
  ],
  "watermint-gin-daily-face-moisturizer": [
    {
      name: "Quinn J.",
      rating: 5,
      comment: "Lightweight moisturizer that absorbs fast and does not shine.",
    },
    {
      name: "Tommy G.",
      rating: 4,
      comment: "Good everyday face moisturizer. Feels fresh and not heavy.",
    },
  ],
  "wide-tooth-comb": [
    {
      name: "Ronnie K.",
      rating: 5,
      comment: "Great for longer hair after showering. Does not snag.",
    },
    {
      name: "Frank A.",
      rating: 4,
      comment: "Sturdy and useful for detangling. Good size for home use.",
    },
  ],
};
