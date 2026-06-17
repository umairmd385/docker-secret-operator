import { H2, PLead, P } from "@/components/ui/Typography";

export function WhyDSOExists() {
  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="space-y-4">
            <H2>Why DSO Exists</H2>
            <PLead>
              DSO is not a secret manager. It's a rotation engine — built specifically for Docker environments.
            </PLead>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {/* Philosophy 1: Docker-native */}
            <div className="space-y-3">
              <h3 className="text-text font-semibold">Docker-native</h3>
              <P>
                Works with Docker Compose and containerized workloads. No Kubernetes, no cloud abstractions — just containers.
              </P>
            </div>

            {/* Philosophy 2: CLI-first */}
            <div className="space-y-3">
              <h3 className="text-text font-semibold">CLI-first</h3>
              <P>
                Designed for operators. Full control from the command line, minimal configuration overhead, no dashboard.
              </P>
            </div>

            {/* Philosophy 3: Recovery-focused */}
            <div className="space-y-3">
              <h3 className="text-text font-semibold">Recovery-focused</h3>
              <P>
                Failures are expected. Automatic recovery handles crashes, timeouts, and network interruptions without manual intervention.
              </P>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
