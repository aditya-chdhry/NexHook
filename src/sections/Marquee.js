const items = [
  'Web Development','Mobile Apps','UI/UX Design','E-Commerce',
  'SaaS Products','SEO & Growth','Brand Identity','React & Next.js','Flutter & Swift',
];

export default function Marquee() {
  const doubled = [...items, ...items];
  return (
    <div className="mq-wrap">
      <div className="mq-track">
        {doubled.map((item, i) => (
          <div className="mq-item" key={i}>
            <div className="mq-dot" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
