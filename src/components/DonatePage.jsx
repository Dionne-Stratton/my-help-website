import { Link } from "react-router-dom";
import donateBanner from "../assets/donate-banner.webp";
import { PAYPAL_SUPPORT_URL } from "../constants/donations";

export default function DonatePage() {
  return (
    <main className="about-page">
      <header className="about-intro">
        <h1>Help encouragement reach another heart.</h1>
        <img src={donateBanner} alt="" className="story-banner" width={2172} height={724} />
        <p>Sometimes a verse, a prayer, or a song can help us pause and turn toward Jesus in the middle of a difficult day. My Help brings those resources together for people seeking comfort, hope, and a reminder of God’s love.</p>
        <p>If My Help has encouraged you and you’d like to support the work behind it, you’re welcome to make a voluntary contribution. Your support helps care for this space and continue developing it for the people who come here.</p>
      </header>

      <section className="about-section" aria-labelledby="donate-purpose">
        <h2 id="donate-purpose">What your contribution supports</h2>
        <p>My Help takes time and ongoing care to build and maintain. Contributions help support the person doing that work, along with the costs of keeping the app available.</p>
        <p>Each time someone asks for help, My Help uses a small amount of AI processing to understand what they’re going through. The app then matches their needs with resources from the library. The Scripture, prayers, reflections, and songs are selected from that library, and each request has a small usage cost that adds up as more people use the app.</p>
        <p>My hope is to keep My Help freely available to anyone who needs encouragement. If you’re able to give, your contribution helps cover those ongoing costs so people can keep coming here for help without needing a paid subscription.</p>
        <dl className="about-resources">
          <div><dt>Thoughtful resources</dt><dd>The time spent creating, selecting, and organizing Scripture, prayers, reflections, and music that point people toward Jesus.</dd></div>
          <div><dt>Continued development</dt><dd>Building useful features, improving the experience, and listening to what would help visitors most.</dd></div>
          <div><dt>Help when something goes wrong</dt><dd>Troubleshooting issues, fixing bugs, and keeping things working smoothly.</dd></div>
          <div><dt>A place that stays freely available</dt><dd>AI processing for help requests, hosting, and the other services that keep My Help running as more people use it.</dd></div>
        </dl>
      </section>

      <section className="about-section" aria-labelledby="donate-paypal">
        <h2 id="donate-paypal">Give as you feel led</h2>
        <p>Contributing is entirely optional. You’re welcome to use My Help whether or not you give, and there’s no obligation to contribute.</p>
        <p>My Help is not a nonprofit or tax-exempt charitable organization. Contributions support its development and operation and are not tax-deductible charitable donations for U.S. federal income tax purposes.</p>
        <a href={PAYPAL_SUPPORT_URL} className="about-cta" target="_blank" rel="noopener noreferrer">Support My Help with PayPal (opens in a new tab)</a>
        <p>You’ll continue to PayPal to make your contribution. Thank you for supporting the time and care behind My Help.</p>
      </section>

      <section className="about-section" aria-labelledby="donate-welcome">
        <h2 id="donate-welcome">You’re welcome here</h2>
        <p>Whether you give, share My Help with someone who could use encouragement, or simply come here for a quiet moment with God, we’re glad you’re here. You can return whenever you need Scripture, prayer, reflection, or music for what’s on your heart.</p>
        <Link to="/" className="about-cta">Find help for this moment</Link>
      </section>
    </main>
  );
}
