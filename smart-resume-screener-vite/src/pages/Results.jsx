import { useLocation } from "react-router-dom";

export default function Results() {
  const location = useLocation();
  const results = location.state?.results;

  return (
    <div>
      <h1>Results</h1>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}

}
