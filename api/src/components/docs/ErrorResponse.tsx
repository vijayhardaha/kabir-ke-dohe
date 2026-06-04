import type { ReactNode } from 'react';

import type { JSX } from 'react/jsx-runtime';

import { CodeBlock } from '@/components/ui/CodeBlock';

/**
 * Props for the InfoCard component.
 */
interface InfoCardProps {
  /** Code/key displayed in the card. */
  code: ReactNode;
  /** Title of the card. */
  title: string;
  /** Description text. */
  children: string;
}

/**
 * Reusable info-card block for field documentation.
 *
 * @param {InfoCardProps} props - Component props.
 *
 * @returns {JSX.Element} The info-card element.
 */
function InfoCard({ code, title, children }: InfoCardProps): JSX.Element {
  return (
    <div className="info-card">
      <div className="info-card-key">
        <code>{code}</code>
      </div>
      <div className="info-card-body">
        <h4 className="mb-1">{title}</h4>
        <p>{children}</p>
      </div>
    </div>
  );
}

/**
 * Component that displays API error response documentation.
 * Shows error response format with an example and a table of common error responses.
 *
 * @returns {JSX.Element} - The rendered error response documentation.
 */
export default function ErrorResponse(): JSX.Element {
  const errorExample = `{
  "code": 400,
  "error": "A descriptive error message"
}`;

  return (
    <section>
      <h2>Error Response Format</h2>
      <p>When an error occurs, the API will return a JSON response with the following structure:</p>

      <CodeBlock code={errorExample} language="json" usePrism={true} />

      <h3>Error Response Fields</h3>
      <div className="mb-8 space-y-4">
        <InfoCard code="code" title="HTTP status code">
          Numeric HTTP status code indicating the result of the request.
        </InfoCard>
        <InfoCard code="error" title="Error message">
          A human-readable error message describing what went wrong.
        </InfoCard>
      </div>

      <h3>Common Error Responses</h3>
      <div className="space-y-4">
        <InfoCard code="400" title="Bad Request">
          Your request had invalid or missing parameters. Review the error message and try again.
        </InfoCard>
        <InfoCard code="404" title="Not Found">
          The endpoint you tried to access does not exist. Check the URL and request method.
        </InfoCard>
        <InfoCard code="500" title="Internal server error">
          Something went wrong on the server side. Try again later or contact support if the problem persists.
        </InfoCard>
      </div>
    </section>
  );
}
