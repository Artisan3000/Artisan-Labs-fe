import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { buildPageMetadata } from "@/lib/metadata";
import FoundationReveal from "./FoundationReveal";
import FoundationImageReveal from "./FoundationImageReveal";
import {
  activations,
  collaboratorRows,
  involvementRoutes,
  methodology,
  openingImage,
  surveyEvidence,
  type Activation,
  type FoundationImage,
} from "./foundationData";
import styles from "./page.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Artisan Foundation",
  description:
    "A record of the Artisan Foundation's youth-focused grooming, wellness, and career-development work.",
  path: "/foundation",
  image: openingImage.src,
});

function ArchiveImage({
  image,
  className,
  sizes,
  priority = false,
  reveal,
}: {
  image: FoundationImage;
  className: string;
  sizes: string;
  priority?: boolean;
  reveal?: { delay?: number; threshold?: number };
}) {
  const figure = (
    <figure className={className}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
      />
      <figcaption>{image.caption}</figcaption>
    </figure>
  );

  if (!reveal) return figure;

  return (
    <FoundationImageReveal
      className={className}
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      caption={image.caption}
      priority={priority}
      delay={reveal.delay}
      threshold={reveal.threshold}
    />
  );
}

function ActivationHeader({ activation }: { activation: Activation }) {
  return (
    <header className={styles.activationHeader}>
      <p className={styles.recordNumber}>Record {activation.number}</p>
      <p className={styles.activationDate}>{activation.date}</p>
      <h3>{activation.title}</h3>
      <p className={styles.activationSummary}>{activation.summary}</p>
    </header>
  );
}

function ActivationLedger({ activation }: { activation: Activation }) {
  return (
    <dl className={styles.activationLedger}>
      {activation.location ? (
        <div>
          <dt>Place</dt>
          <dd>{activation.location}</dd>
        </div>
      ) : null}
      {activation.participantCount ? (
        <div>
          <dt>Attendance</dt>
          <dd>{activation.participantCount}</dd>
        </div>
      ) : null}
      {activation.collaborators.length ? (
        <div>
          <dt>With</dt>
          <dd>{activation.collaborators.join("; ")}</dd>
        </div>
      ) : null}
      <div>
        <dt>Activity</dt>
        <dd>{activation.activities.join("; ")}</dd>
      </div>
    </dl>
  );
}

function ActivationRecord({ activation }: { activation: Activation }) {
  if (activation.treatment === "sparse") {
    return (
      <FoundationReveal
        as="article"
        id={activation.id}
        className={`${styles.activation} ${styles.sparseActivation}`}
        kind="record"
        threshold={0.06}
      >
        <p className={styles.sparseSeason}>{activation.date.split(" ")[0]}</p>
        <div className={styles.sparseYear}>{activation.year}</div>
        <div className={styles.sparseRecord}>
          <ActivationHeader activation={activation} />
          <ActivationLedger activation={activation} />
        </div>
      </FoundationReveal>
    );
  }

  if (activation.id === "bronx-academy-launch") {
    return (
      <article id={activation.id} className={`${styles.activation} ${styles.launch}`}>
        <FoundationReveal className={styles.yearAnchor} kind="record" threshold={0.12}>
          <div aria-hidden="true">{activation.year}</div>
        </FoundationReveal>
        <FoundationReveal className={styles.launchCopy} kind="record" threshold={0.12}>
          <ActivationHeader activation={activation} />
          <ActivationLedger activation={activation} />
        </FoundationReveal>
        <ArchiveImage
          image={activation.images[0]}
          className={styles.launchLead}
          sizes="(max-width: 700px) calc(100vw - 2rem), (max-width: 1100px) 62vw, 760px"
          reveal={{ delay: 0.12, threshold: 0.08 }}
        />
        <ArchiveImage
          image={activation.images[1]}
          className={styles.launchSupport}
          sizes="(max-width: 700px) 68vw, (max-width: 1100px) 34vw, 430px"
          reveal={{ delay: 0.2, threshold: 0.06 }}
        />
        <ArchiveImage
          image={activation.images[2]}
          className={styles.launchInset}
          sizes="(max-width: 700px) 54vw, 300px"
          reveal={{ delay: 0.2, threshold: 0.06 }}
        />
      </article>
    );
  }

  if (activation.id === "finance-collective-focus") {
    return (
      <article id={activation.id} className={`${styles.activation} ${styles.finance2022}`}>
        <FoundationReveal
          className={styles.finance2022Copy}
          kind="record"
          threshold={0.06}
        >
          <ActivationHeader activation={activation} />
          <ActivationLedger activation={activation} />
        </FoundationReveal>
        <ArchiveImage
          image={activation.images[0]}
          className={styles.financePortrait}
          sizes="(max-width: 700px) 62vw, 420px"
          reveal={{ delay: 0.1, threshold: 0.06 }}
        />
        <div className={styles.archivalPair}>
          <ArchiveImage
            image={activation.images[1]}
            className={styles.archivalInset}
            sizes="(max-width: 700px) 42vw, 260px"
            reveal={{ delay: 0.18, threshold: 0.05 }}
          />
          <ArchiveImage
            image={activation.images[2]}
            className={styles.archivalInset}
            sizes="(max-width: 700px) 42vw, 260px"
            reveal={{ delay: 0.18, threshold: 0.05 }}
          />
        </div>
      </article>
    );
  }

  if (activation.id === "harrys-mental-health") {
    return (
      <article id={activation.id} className={`${styles.activation} ${styles.harrys}`}>
        <FoundationReveal className={styles.harrysYear} kind="record" threshold={0.1}>
          <div aria-hidden="true">2023</div>
        </FoundationReveal>
        <FoundationReveal className={styles.harrysIntro} kind="record" threshold={0.12}>
          <ActivationHeader activation={activation} />
          <ActivationLedger activation={activation} />
        </FoundationReveal>
        <ArchiveImage
          image={activation.images[0]}
          className={styles.harrysLead}
          sizes="(max-width: 700px) calc(100vw - 2rem), (max-width: 1100px) calc(100vw - 4rem), 1200px"
          reveal={{ delay: 0.1, threshold: 0.08 }}
        />
        <ArchiveImage
          image={activation.images[1]}
          className={styles.harrysPortraitA}
          sizes="(max-width: 700px) 68vw, 440px"
          reveal={{ delay: 0.16, threshold: 0.06 }}
        />
        <ArchiveImage
          image={activation.images[2]}
          className={styles.harrysPortraitB}
          sizes="(max-width: 700px) 55vw, 360px"
          reveal={{ delay: 0.16, threshold: 0.06 }}
        />
        <ArchiveImage
          image={activation.images[3]}
          className={styles.harrysLandscape}
          sizes="(max-width: 700px) 84vw, 650px"
          reveal={{ delay: 0.22, threshold: 0.08 }}
        />
      </article>
    );
  }

  if (activation.id === "all-kings") {
    return (
      <article id={activation.id} className={`${styles.activation} ${styles.allKings}`}>
        <FoundationReveal
          className={styles.allKingsCopy}
          kind="record"
          threshold={0.06}
        >
          <ActivationHeader activation={activation} />
          <ActivationLedger activation={activation} />
        </FoundationReveal>
        <ArchiveImage
          image={activation.images[0]}
          className={styles.allKingsLead}
          sizes="(max-width: 700px) calc(100vw - 2rem), (max-width: 1100px) 62vw, 780px"
          reveal={{ delay: 0.1, threshold: 0.08 }}
        />
        <ArchiveImage
          image={activation.images[1]}
          className={styles.allKingsPortrait}
          sizes="(max-width: 700px) 62vw, 390px"
          reveal={{ delay: 0.18, threshold: 0.06 }}
        />
      </article>
    );
  }

  return (
    <FoundationReveal
      as="article"
      id={activation.id}
      className={`${styles.activation} ${styles.ripe}`}
      kind="record"
      threshold={0.02}
    >
      <div className={styles.ripeYear} aria-hidden="true">
        2024
      </div>
      <div className={styles.ripeHeading}>
        <ActivationHeader activation={activation} />
      </div>
      <div className={styles.ripeLedger}>
        <ActivationLedger activation={activation} />
      </div>
      <ArchiveImage
        image={activation.images[0]}
        className={styles.ripeLead}
        sizes="(max-width: 700px) calc(100vw - 2rem), (max-width: 1100px) calc(100vw - 4rem), 1200px"
        reveal={{ delay: 0.1, threshold: 0.08 }}
      />
      <ArchiveImage
        image={activation.images[1]}
        className={styles.ripePresentation}
        sizes="(max-width: 700px) 80vw, (max-width: 1100px) 58vw, 720px"
        reveal={{ delay: 0.16, threshold: 0.06 }}
      />
      <ArchiveImage
        image={activation.images[2]}
        className={styles.ripeExercise}
        sizes="(max-width: 700px) 62vw, (max-width: 1100px) 46vw, 520px"
        reveal={{ delay: 0.22, threshold: 0.06 }}
      />
    </FoundationReveal>
  );
}

export default function FoundationPage() {
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="foundation-title">
          <div className={styles.heroMeta}>
            <p>Artisan Foundation</p>
            <p>A record beginning in 2021</p>
          </div>
          <h1 id="foundation-title">
            Grooming, wellness, and career development for youth.
          </h1>
          <p className={styles.heroIntro}>
            Run by the Artisan Barber team, the Foundation brings grooming,
            wellness, and career development into youth-focused programming.
            Activations combine personal care with practical exposure to
            professionals, creative work, business, and career paths.
          </p>
        </section>

        <section className={styles.documentaryProof} aria-label="Foundation archive opening">
          <FoundationImageReveal
            className={styles.revealFrame}
            src={openingImage.src}
            alt={openingImage.alt}
            width={openingImage.width}
            height={openingImage.height}
            sizes="(max-width: 700px) calc(100vw - 2rem), (max-width: 1280px) calc(100vw - 4rem), 1200px"
            priority
            threshold={0.08}
          />
          <FoundationReveal
            className={styles.proofCaption}
            kind="caption"
            delay={0.25}
            threshold={0.1}
          >
            <p>{openingImage.caption}</p>
            <p>01 / 07</p>
          </FoundationReveal>
        </section>

        <section className={styles.methodSection} aria-labelledby="method-heading">
          <header className={styles.sectionIntro}>
            <p className={styles.sectionLabel}>Methodology</p>
            <h2 id="method-heading">Care opens the conversation.</h2>
          </header>
          <div className={styles.methodList}>
            {methodology.map((method) => (
              <article className={styles.method} key={method.number}>
                <p className={styles.methodNumber}>{method.number}</p>
                <h3>{method.heading}</h3>
                <p>{method.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.evidence} aria-labelledby="evidence-heading">
          <header className={styles.evidenceHeader}>
            <p className={styles.sectionLabel}>Survey evidence</p>
            <h2 id="evidence-heading">What respondents reported.</h2>
            <p>
              These statements appear in the supplied Foundation survey. Its
              sample size, respondent group, date, and methodology have not yet
              been established for publication.
            </p>
          </header>
          <div className={styles.evidenceRows}>
            {surveyEvidence.map((item) => (
              <div className={styles.evidenceRow} key={item.value}>
                <p className={styles.evidenceValue}>{item.value}</p>
                <p>{item.statement}</p>
                <p className={styles.evidenceScope}>Reported survey response</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.archiveThreshold} aria-labelledby="archive-heading">
          <p className={styles.sectionLabel}>Foundation archive</p>
          <h2 id="archive-heading">Activations, 2021—2025</h2>
          <p>
            Seven supplied records trace a progression from grooming and
            entrepreneurship to wellness, product work, finance, and career
            conversation.
          </p>
          <nav className={styles.archiveIndex} aria-label="Foundation archive by year">
            <a href="#bronx-academy-launch">2021</a>
            <a href="#bronx-academy-spring">2022</a>
            <a href="#harrys-mental-health">2023</a>
            <a href="#ripe-finance">2024</a>
            <a href="#career-day">2025</a>
          </nav>
        </section>

        <section className={styles.archive} aria-label="Chronological activation archive">
          {activations.map((activation) => (
            <ActivationRecord activation={activation} key={activation.id} />
          ))}
        </section>

        <section className={styles.collaborators} aria-labelledby="collaborators-heading">
          <header className={styles.collaboratorHeading}>
            <p className={styles.sectionLabel}>Community in the record</p>
            <h2 id="collaborators-heading">People, practice, and participation.</h2>
          </header>
          <div className={styles.collaboratorIndex}>
            {collaboratorRows.map((row) => (
              <article className={styles.collaboratorEntry} key={row.name}>
                <h3>{row.name}</h3>
                <p>
                  <time>{row.date}</time>
                  <span aria-hidden="true"> — </span>
                  {row.contribution}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.invitation} aria-labelledby="invitation-heading">
          <div>
            <p className={styles.sectionLabel}>The next record</p>
            <h2 id="invitation-heading">Work with the Foundation.</h2>
            <p className={styles.invitationCopy}>
              We are interested in conversations with schools, working
              professionals, community organizations, and product partners who
              can contribute to future Foundation programming.
            </p>
          </div>
          <div className={styles.involvementRoutes}>
            {involvementRoutes.map((route) => (
              <p key={route}>{route}</p>
            ))}
            <span className={styles.developmentCta}>Contact details forthcoming</span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
