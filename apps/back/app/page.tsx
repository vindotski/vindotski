import { getFragments, getProfile, getProjects } from "@/lib/cms";

export default async function Home() {
  const [profile, projects, fragments] = await Promise.all([getProfile(), getProjects(), getFragments()]);

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col justify-center gap-8 p-6">
      <header className="flex flex-col gap-2">
        {profile.role && (
          <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">{profile.role}</p>
        )}
        <h1 className="font-heading text-4xl font-medium">{profile.name}</h1>
        {profile.headline && <p className="text-lg text-muted-foreground">{profile.headline}</p>}
      </header>

      {projects.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-xl font-medium">Projects</h2>
          <ul className="flex flex-col gap-2">
            {projects.map((project) => (
              <li key={project.documentId}>
                <span className="font-medium">{project.title}</span>
                {project.summary && <span className="text-muted-foreground"> · {project.summary}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {fragments.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-xl font-medium">Fragments</h2>
          <ul className="flex flex-col gap-2">
            {fragments.map((fragment) => (
              <li key={fragment.documentId} className="flex items-baseline gap-3">
                {fragment.kind && (
                  <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">{fragment.kind}</span>
                )}
                <span>{fragment.title}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
