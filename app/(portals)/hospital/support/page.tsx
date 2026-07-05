import { Phone, MessageCircle, Mail } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaqSection } from "@/components/hospital/faq-section";
import { RaiseTicketDialog } from "@/components/hospital/raise-ticket-dialog";
import { TicketsTable } from "@/components/hospital/tickets-table";
import { getSupportTickets } from "@/lib/data/hospital";

export default function SupportCenterPage() {
  const tickets = getSupportTickets();

  return (
    <div>
      <PageHeader title="Support Center" description="FAQs, contact options and support ticket tracking." actions={<RaiseTicketDialog />} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Phone className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">Call Support</CardTitle>
            <CardDescription>+91 80-4712-0000</CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
        <Card>
          <CardHeader>
            <MessageCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">WhatsApp Support</CardTitle>
            <CardDescription>+91 98450-11223</CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
        <Card>
          <CardHeader>
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">Email Support</CardTitle>
            <CardDescription>support@vitapartner.demo</CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <FaqSection />
        </CardContent>
      </Card>

      <h2 className="mt-8 mb-4 text-lg font-semibold">Support Tickets</h2>
      <TicketsTable tickets={tickets} />
    </div>
  );
}
