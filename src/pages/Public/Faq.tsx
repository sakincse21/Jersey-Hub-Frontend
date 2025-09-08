import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    id: "faq-1",
    question: "How do I find the right size for my jersey?",
    answer:
      "We provide a detailed size chart on each product page with measurements for chest and length. We recommend comparing these measurements with a jersey you already own to ensure the best fit.",
  },
  {
    id: "faq-2",
    question: "Are your jerseys authentic?",
    answer:
      "We offer high-quality fan versions and player versions. Fan versions are a standard fit, while player versions are a slimmer, athletic fit. Please check the product description for details on each jersey.",
  },
  {
    id: "faq-3",
    question: "What is your return and exchange policy?",
    answer:
      "We accept returns and exchanges for unworn items with tags attached within 14 days of delivery. Please note that customized jerseys with custom names or numbers are non-refundable.",
  },
  {
    id: "faq-4",
    question: "How long does shipping take?",
    answer:
      "Standard shipping within Bangladesh typically takes 3-5 business days. You will receive a tracking number via email once your order has been shipped.",
  },
  {
    id: "faq-5",
    question: "How should I care for my jersey?",
    answer:
      "To maintain the quality of your jersey, we recommend washing it inside out with cold water on a gentle cycle. Hang it to dry and avoid using a machine dryer or ironing the printed areas.",
  },
  {
    id: "faq-6",
    question: "Can I customize a jersey with my own name and number?",
    answer:
      "Yes! Many of our jerseys have a customization option. On the product page, you can enter the name and number you'd like to have printed.",
  },
  {
    id: "faq-7",
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit cards, Stripe, and Cash on Delivery (COD) for orders within Bangladesh.",
  },
  {
    id: "faq-8",
    question: "How can I track my order?",
    answer:
      "Once your order is dispatched, we will send you an email containing a tracking number and a link to the courier's website where you can monitor your package's journey.",
  },
];

const Faq = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-center text-3xl font-bold md:mb-12 md:text-4xl">
          Frequently Asked Questions
        </h1>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export { Faq };
