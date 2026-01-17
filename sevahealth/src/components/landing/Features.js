import { Badge } from "@/src/components/ui/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/Card";

const features = [
  {
    title: "Offline-first patient records",
    description:
      "Capture patient details, visits, and follow-ups even with zero network. Data syncs automatically when connectivity is restored.",
    badge: "Offline sync",
  },
  {
    title: "Worker & patient management",
    description:
      "Track ASHA workers, their assigned households, and patient status across villages from one dashboard.",
    badge: "Field operations",
  },
  {
    title: "Smart alerts & escalations",
    description:
      "Receive alerts for high-risk cases, missed visits, and overdue follow-ups so vulnerable patients are never overlooked.",
    badge: "Priority care",
  },
  {
    title: "Secure, PHC-ready architecture",
    description:
      "Built on Supabase with role-based access and strong security defaults to keep health data safe.",
    badge: "Secure by design",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-top bg-background py-16 sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
        <div className="max-w-2xl space-y-3">
          <Badge variant="secondary">Why SevaHealth</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Designed for real-world public health workflows.
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            From PHC staff to ASHA workers, everyone sees the right view for
            their role—while coordinators get a single source of truth across
            all field operations.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="h-full">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  {feature.badge && (
                    <Badge className="text-xs">{feature.badge}</Badge>
                  )}
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                  <li>Works on low-cost Android devices.</li>
                  <li>Simple UX for quick onboarding.</li>
                  <li>Extendable for new schemes/programs.</li>
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
