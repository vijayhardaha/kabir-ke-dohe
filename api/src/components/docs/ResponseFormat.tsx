import type { JSX } from 'react/jsx-runtime';

import { CodeBlock } from '@/components/ui/CodeBlock';

/**
 * Props for the FieldRow component.
 */
interface FieldRowProps {
  /** The field name/path displayed inside a <code> tag. */
  field: string;
  /** Description of the field. */
  children: string;
}

/**
 * A single row in the response fields table.
 *
 * @param {FieldRowProps} props - Component props.
 *
 * @returns {JSX.Element} A table row with field
code and description.
 */
function FieldRow({ field, children }: FieldRowProps): JSX.Element {
  return (
    <tr>
      <td>
        <code>{field}</code>
      </td>
      <td>{children}</td>
    </tr>
  );
}

/**
 * Component that displays the API response format.
 * Shows the structure of a successful API response with an example.
 *
 * @returns {JSX.Element} - The
rendered response format documentation
 */
export default function ResponseFormat(): JSX.Element {
  const responseExample = `{
  "success": true,
  "data": {
    "posts": [
      {
        "number": 1,
        "slug": "couplet-slug",
        "text_hi": "हिन्दी में दोहा",
        "text_en": "English couplet",
        "meaning_hi": "हिन्दी में अर्थ",
        "meaning_en": "English meaning",
        "category": {
          "name": "Category Name",
          "slug": "category-slug"
        },
        "tags": [
          {
            "slug": "tag1",
            "name": "Tag 1"
          },
          {
            "slug": "tag2",
            "name": "Tag 2"
          }
        ],
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "totalPages": 10,
    "page": 1,
    "per_page": 10,
    "pagination": true
  }
}`;

  return (
    <section id="response-format">
      <h2>Response Format</h2>
      <p>Successful API requests return JSON with the following structure:</p>

      <CodeBlock code={responseExample} language="json" usePrism={true} />

      <h3>Response Fields</h3>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <FieldRow field="success">Boolean indicating if the request was successful</FieldRow>
            <FieldRow field="data.posts">Array of post objects</FieldRow>
            <FieldRow field="data.total">Total number of records matching the query</FieldRow>
            <FieldRow field="data.totalPages">Total number of pages</FieldRow>
            <FieldRow field="data.page">Current page number</FieldRow>
            <FieldRow field="data.per_page">Number of results per page</FieldRow>
            <FieldRow field="data.pagination">Boolean indicating if pagination is enabled</FieldRow>
            <FieldRow field="posts[].number">Post number/identifier</FieldRow>
            <FieldRow field="posts[].slug">URL-friendly slug</FieldRow>
            <FieldRow field="posts[].text_hi">Couplet text in Hindi</FieldRow>
            <FieldRow field="posts[].text_en">Couplet text in English</FieldRow>
            <FieldRow field="posts[].meaning_hi">Meaning in Hindi (nullable)</FieldRow>
            <FieldRow field="posts[].meaning_en">Meaning in English (nullable)</FieldRow>
            <FieldRow field="posts[].category">Category object with name and slug</FieldRow>
            <FieldRow field="posts[].tags">Array of tag objects with slug and name</FieldRow>
            <FieldRow field="posts[].created_at">Timestamp when the post was created</FieldRow>
            <FieldRow field="posts[].updated_at">Timestamp when the post was last updated</FieldRow>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm">
        See <a href="#query-parameters">query parameters</a> for how to control pagination and filtering of fields.
      </p>
    </section>
  );
}
