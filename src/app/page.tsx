export default function Home() {
  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-semibold">Run your roofing business like a ninja.</h1>
      <p className="text-neutral-600">
        Day-1 foundation is live: orgs, auth, invites (audit logged), Stripe subscriptions, and a secure app shell.
      </p>
      <div className="flex gap-3">
        <a href="/login" className="px-4 py-2 rounded bg-black text-white">Get Started</a>
        <a href="/app" className="px-4 py-2 rounded border">Open App</a>
      </div>
    </section>
  );
}
