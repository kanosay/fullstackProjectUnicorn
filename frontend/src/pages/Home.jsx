import Hero from "../components/Hero";
import Row from "../components/Row";
import { endpoints } from "../api/tmdb";

export default function Home() {
  return (
    <main className="home">
      <Hero />
      <div className="rows">
        <Row title="Trending Now"     endpoint={endpoints.trending} />
        <Row title="Top Rated"        endpoint={endpoints.topRated} />
        <Row title="Popular on Netflix" endpoint={endpoints.popular} />
        <Row title="Action & Adventure" endpoint={endpoints.action} />
        <Row title="Comedies"         endpoint={endpoints.comedy} />
        <Row title="Horror Movies"    endpoint={endpoints.horror} />
        <Row title="Romance"          endpoint={endpoints.romance} />
        <Row title="Documentaries"    endpoint={endpoints.documentary} />
        <Row title="Coming Soon"      endpoint={endpoints.upcoming} />
      </div>
      <footer className="footer">
        <p>Abdurakhim Doszhanuly student of Unicorn University</p>
      </footer>
    </main>
  );
}
