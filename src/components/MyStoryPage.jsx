import { Link } from "react-router-dom";
import storyBanner from "../assets/my-story-banner.webp";

export default function MyStoryPage() {
  return (
    <main className="about-page">
      <header className="about-intro">
        <h1>Help for the moment you’re in.</h1>
        <img src={storyBanner} alt="" className="story-banner" width={2048} height={768} />
        <p>I’m the developer behind Clear Path Creative and the person who created My Help. The idea grew out of something I needed in my own life: a way to find encouragement in the very moment I was struggling.</p>
      </header>

      <section className="about-section" aria-labelledby="story-moment">
        <h2 id="story-moment">When encouragement is hard to gather</h2>
        <p>Sometimes I feel down, frustrated, or overwhelmed by my emotions. In that moment, there isn’t always someone I can reach out to, so I turn to what I know can help me draw near to God.</p>
        <p>I know Scripture well, and I’ll remind myself of passages that speak to what I’m feeling. I meditate on those words, encourage myself with them, and try to pray through what’s on my heart.</p>
        <p>Songs can help me find encouragement, too, especially when they’re grounded in Scripture and reinforce the truth I need to remember. I might pull up a song to listen to, or simply sing one that comes to mind as I work through that moment.</p>
      </section>

      <section className="about-section" aria-labelledby="story-idea">
        <h2 id="story-idea">“This would be easier if it were in an app.”</h2>
        <p>One day, while I was doing exactly that, the idea came to me. What if I didn’t have to think of all those resources on the spot while I was already distressed?</p>
        <p>What if I could simply explain what I was dealing with and have Scripture, prayer, reflection, and music brought together for me? That became the idea behind My Help: a place to find the kind of encouragement I was trying to gather for myself.</p>
      </section>

      <section className="about-section" aria-labelledby="story-name">
        <h2 id="story-name">Why “My Help”?</h2>
        <p>The song that came to mind as I was encouraging myself that day was one of my own songs, titled “My Help.” When I began thinking about what to call the app, that name seemed fitting.</p>
        <p>It connected the app to the very moment that inspired it. It also expressed what I hoped this little collection of resources could offer: help for someone right where they are.</p>
      </section>

      <section className="about-section" aria-labelledby="story-heart">
        <h2 id="story-heart">For me, and for you in your moment</h2>
        <p>The resources My Help brings together reflect what I wish I had readily available when my emotions feel overwhelming. They’re the kinds of things I reach for myself: Scripture to meditate on, words to help me pray, a reflection to consider, and a song that speaks to what I’m going through.</p>
        <p>I made this for myself, but also for anyone who finds themselves struggling and doesn’t have someone they can reach out to in that particular moment. That word matters to me: moment. It’s the reason you’ll see it throughout the app.</p>
        <p>My hope is that you can come here, share what you’re facing in your own words, and find encouragement that helps you turn toward Jesus. Whatever has brought you here today, you’re welcome to begin with the moment you’re in.</p>
        <Link to="/" className="about-cta">Find help for this moment</Link>
      </section>
    </main>
  );
}
