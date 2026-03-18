export default function Home() {
  return (
    <div className="min-h-screen bg-dracula-background flex flex-col items-center justify-center p-6 space-y-6">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-dracula-pink animate-pulse">
        Welcome to CmdSheet
      </h1>

      {/* Description */}
      <p className="text-dracula-foreground text-lg text-center max-w-xl">
        This is a test page to make sure your Tailwind + Dracula theme is
        working correctly with React Router.
      </p>

      {/* Buttons using Dracula colors */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button className="bg-dracula-green text-dracula-background px-4 py-2 rounded shadow hover:bg-dracula-cyan hover:text-dracula-background transition-colors">
          Green Button
        </button>
        <button className="bg-dracula-orange text-dracula-background px-4 py-2 rounded shadow hover:bg-dracula-red hover:text-dracula-foreground transition-colors">
          Orange Button
        </button>
        <button className="bg-dracula-purple text-dracula-background px-4 py-2 rounded shadow hover:bg-dracula-pink hover:text-dracula-foreground transition-colors">
          Purple Button
        </button>
        <button className="bg-dracula-cyan text-dracula-background px-4 py-2 rounded shadow hover:bg-dracula-green hover:text-dracula-background transition-colors">
          Cyan Button
        </button>
      </div>

      {/* Sample cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <div className="bg-dracula-currentline p-4 rounded shadow hover:border-dracula-purple border transition-colors">
          <h3 className="text-dracula-foreground font-semibold text-lg mb-2">
            Snippet Card
          </h3>
          <p className="text-dracula-comment text-sm">
            Example snippet card showing background and text colors.
          </p>
        </div>

        <div className="bg-dracula-currentline p-4 rounded shadow hover:border-dracula-pink border transition-colors">
          <h3 className="text-dracula-foreground font-semibold text-lg mb-2">
            Group Card
          </h3>
          <p className="text-dracula-comment text-sm">
            Example group card showing Dracula theme colors.
          </p>
        </div>
      </div>
    </div>
  );
}
