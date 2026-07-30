import { Helmet } from "react-helmet-async";

export default function SEO({
  title,
  description,
}) {
  const fullTitle = title
    ? `${title} | Library College`
    : "Library College";

  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta
        name="description"
        content={
          description ??
          "Електронна бібліотека навчального закладу."
        }
      />
    </Helmet>
  );
}