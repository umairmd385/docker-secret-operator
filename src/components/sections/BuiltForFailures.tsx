import { H2, P } from "@/components/ui/Typography";
import Link from "next/link";

export function BuiltForFailures() {
  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-4">
            <H2>Built for Failures</H2>
            <P className="text-lg">
              DSO expects failures. Automatic recovery handles crashes, timeouts, and network interruptions without manual intervention.{" "}
              <Link href="/architecture#recovery" className="text-accent hover:text-accent/80 font-medium underline">
                Learn how recovery works →
              </Link>
            </P>
          </div>
        </div>
      </div>
    </section>
  );
}
