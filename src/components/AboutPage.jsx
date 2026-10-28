import logo from "../assets/logo.png";

export default function AboutPage({ onShowCrisisHelp }) {
  return (
    <main className="about-page">
      <header className="about-intro">
        <img src={logo} alt="My Help" className="about-logo" />
        <p className="about-eyebrow">About My Help</p>
        <h1>A little encouragement for what feels heavy.</h1>
        <p>Some days, finding the words to pray or knowing where to turn can feel hard. My Help offers a place to share what’s weighing on your heart and find Scripture, prayer, reflection, and music to encourage you.</p>
        <p>Whether you’re feeling anxious, lonely, discouraged, or simply in need of a reminder of God’s love, you can start right where you are and find the help that you need.</p>
      </header>

      <section className="about-section" aria-labelledby="about-how">
        <h2 id="about-how">Tell us what’s on your heart</h2>
        <p>Write about what you’re going through in your own words, just as you might tell a friend. A sentence or two is enough, and you’re welcome to share more. There are no special keywords or perfect phrases to find.</p>
        <blockquote>“I’m worried about tomorrow, and I’m having a hard time resting tonight.”</blockquote>
        <p>Select <strong>Find help</strong>, and My Help will bring together a collection of encouragement for that moment. We call this your help bundle: resources you can read, pray through, and listen to at your own pace.</p>
      </section>

      <section className="about-section" aria-labelledby="about-resources">
        <h2 id="about-resources">A few ways to pause and be encouraged</h2>
        <dl className="about-resources">
          <div><dt>Scripture to hold onto</dt><dd>Bible passages that speak into what you’re facing and help turn your attention toward God’s truth and promises.</dd></div>
          <div><dt>A reflection to sit with</dt><dd>A short devotional thought to help you consider that truth in the middle of everyday life.</dd></div>
          <div><dt>A prayer to begin with</dt><dd>Words you can pray as they are or make your own when you’re unsure how to start talking with God.</dd></div>
          <div><dt>A song for this moment</dt><dd>Music you can listen to as you rest, reflect, or carry on with your day, with lyrics to follow along.</dd></div>
        </dl>
        <p>You don’t have to work through everything. Start with the verse, prayer, reflection, or song that meets you where you are. If something else is weighing on you, you can create a new moment and share again.</p>
      </section>

      <section className="about-section" aria-labelledby="about-heart">
        <h2 id="about-heart">An invitation to turn toward Jesus</h2>
        <p>My Help is rooted in the Bible and the hope we have in Jesus Christ. Its heart is to help you draw near to Him and remember His love and presence, especially in the moments when you feel alone.</p>
        <p>Whether you’ve walked with Jesus for years or are just beginning to explore faith, you’re welcome here. These resources offer spiritual encouragement alongside the care and support of trusted people in your life.</p>
        <p>You can try My Help without creating an account. Bring what’s on your heart, take a quiet moment, and see what encouragement you find.</p>
        <a href="#help" className="about-cta">Find help for this moment</a>
      </section>
      <footer className="about-disclaimer">
        <p>My Help offers spiritual encouragement and is not a substitute for professional counseling, mental health care, or medical treatment. If you need additional support, please reach out to a qualified professional.</p>
        <p>If you’re in crisis or thinking about hurting yourself, please seek immediate help. Use the crisis support number in the top-right corner. If you’ve closed it, you can <button type="button" onClick={onShowCrisisHelp}>show crisis support</button> again.</p>
      </footer>
    </main>
  );
}
