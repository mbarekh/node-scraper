import { jobsInfo } from "./data";

export default function Home() {
  return (
    <div>
      <pre>{JSON.stringify(jobsInfo, null, 2)}</pre>
    </div>
  );
}
