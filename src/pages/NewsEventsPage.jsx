import ExpertiseSection from '../components/ExpertiseSection'
import NewsEventsHero from '../components/NewsEventsHero'
import './NewsEventsPage.css'

const REVIEWS = [
    {
        id: 1,
        rating: 5,
        quote:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gallery of type and scrambled it to make a type specimen book.",
        name: 'Lorem D. Ipsum',
        role: 'Customer',
    },
    {
        id: 2,
        rating: 5,
        quote:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gallery of type and scrambled it to make a type specimen book.",
        name: 'Lorem D. Ipsum',
        role: 'Customer',
    },
    {
        id: 3,
        rating: 5,
        quote:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gallery of type and scrambled it to make a type specimen book.",
        name: 'Lorem D. Ipsum',
        role: 'Customer',
    },
    {
        id: 4,
        rating: 5,
        quote:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gallery of type and scrambled it to make a type specimen book.",
        name: 'Lorem D. Ipsum',
        role: 'Customer',
    },
]

function StarIcon() {
    return (
        <svg
            className="news-star-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="#F4B740"
                stroke="#F4B740"
                strokeWidth="1"
            />
        </svg>
    )
}

function ReviewCard({ review }) {
    return (
        <article className="news-review-card">
            <div className="news-review-card__stars">
                {Array.from({ length: review.rating }, (_, i) => (
                    <StarIcon key={i} />
                ))}
            </div>
            <p className="news-review-card__label">Reviews</p>
            <blockquote className="news-review-card__quote">
                &ldquo;{review.quote}&rdquo;
            </blockquote>
            <div className="news-review-card__author">
                <div className="news-review-card__avatar" aria-hidden="true" />
                <div className="news-review-card__author-info">
                    <p className="news-review-card__author-name">{review.name}</p>
                    <p className="news-review-card__author-role">{review.role}</p>
                </div>
            </div>
        </article>
    )
}

export default function NewsEventsPage() {
    return (
        <>
            {/* Hero Section */}
            <NewsEventsHero />

            <ExpertiseSection />

            {/* Trusted By — Review Cards Section */}
            <section className="news-trusted-section">
                <div className="news-trusted__container">
                    <h2 className="news-trusted__heading">
                        Trusted by
                        <br />
                        Thousands of People
                        <br />
                        and Companies
                    </h2>

                    <div className="news-trusted__grid">
                        {REVIEWS.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
