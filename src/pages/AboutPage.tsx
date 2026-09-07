import { ExternalLink } from '../components/a11y'
import { Page } from '../components/Field'

export function AboutPage() {
  return (
    <Page>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">About</h1>
      <section className="space-y-4 rounded-xl bg-white p-6 text-[1.05rem] leading-relaxed text-ink shadow-xs sm:p-8">
        <p>
          This web app is a compilation of information on voter enrolment and turnout (meaning,
          &lsquo;turning out&rsquo; to vote, showing up to vote). The work was driven by the many
          conversations about the rules for voter enrolment and turnout in the lead up to the 2026
          General Election.
        </p>
        <p>
          It&rsquo;s often hard to find the answers, so this app draws on the Electoral Commission
          website, the Electoral Act, and other key resources like the Independent Electoral Review
          to provide the answers.
        </p>
        <p>
          The content has been reviewed by experts, but we recognise there might be issues. If you
          spot an error or would like to provide feedback, then please get in touch with us through
          emailing{' '}
          <a
            href="mailto:turnout@inzight.co.nz"
            className="focus-ring rounded-xs text-accent underline break-all"
          >
            turnout@inzight.co.nz
          </a>
          .
        </p>
        <p>
          This app was funded and created by{' '}
          <ExternalLink
            href="https://www.royalsociety.org.nz/what-we-do/funds-and-opportunities/rutherford-discovery-fellowships/rutherford-discovery-fellowship-recipients/lara-greaves"
            className="focus-ring rounded-xs text-accent underline"
          >
            Lara Greaves&rsquo; Rutherford Discovery Fellowship
          </ExternalLink>{' '}
          from the Royal Society Te Apārangi. The app was developed and is hosted by{' '}
          <ExternalLink
            href="https://inzight.co.nz"
            className="focus-ring rounded-xs text-accent underline"
          >
            iNZight Analytics Ltd
          </ExternalLink>
          .
        </p>
        <p className="border-t border-ink/15 pt-4 text-sm text-ink/80">
          Authorised by Lara Greaves, c/o iNZight Analytics{' '}
          <ExternalLink
            href="https://inzight.co.nz/"
            className="focus-ring rounded-xs text-accent underline break-all"
          >
            https://inzight.co.nz/
          </ExternalLink>
        </p>
      </section>
    </Page>
  )
}
