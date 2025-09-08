import { Link } from "react-router";

const ReturnPolicy = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-center text-3xl font-bold md:mb-12 md:text-4xl">
          Return & Replacement Policy
        </h1>
        <div className="space-y-8 text-muted-foreground">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Our Commitment to You
            </h2>
            <p>
              We strive to ensure you are completely satisfied with every
              purchase. However, we understand that sometimes things don't go as
              planned. Our return policy is designed to be as fair and
              straightforward as possible.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              1. On-the-Spot Returns (At Time of Delivery)
            </h2>
            <p>
              As outlined in our{" "}
              <Link to="/delivery-policy" className="text-primary hover:underline">
                Delivery Policy
              </Link>
              , we highly recommend you inspect your product(s) in front of the
              courier.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Faulty or Damaged Products:</strong> If you receive a
                product that is damaged, defective, or not the item you
                ordered, you can return it to the courier person immediately{" "}
                <strong>at no cost</strong>.
              </li>
              <li>
                Once you have accepted the package and the courier has left,
                this on-the-spot return option is no longer available.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              2. Returns After Delivery (Within 3 Days)
            </h2>
            <p>
              If you need to initiate a return after you have accepted the
              delivery, you may do so within <strong>3 days</strong> of receiving
              the item, subject to the following conditions:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Size Mismatch:</strong> If the jersey does not fit you
                correctly, you can request a size exchange. For this service, a
                return charge of <strong>50 BDT</strong> will be applicable to
                cover courier fees.
              </li>
              <li>
                <strong>Faulty Product Discovery:</strong> If you discover a
                manufacturing defect after delivery that was not apparent during
                the initial inspection, you can also initiate a return within 3
                days. In this case, the return charge will be waived upon
                verification.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              3. Conditions for a Valid Return
            </h2>
            <p>
              For a return to be accepted, the item must meet the following
              criteria:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>The item must be unused, unworn, and unwashed.</li>
              <li>
                The item must be in its original condition with all tags and
                packaging intact.
              </li>
              <li>
                Customized jerseys (with custom names/numbers) are not eligible
                for return or exchange unless there is a manufacturing defect.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              4. How to Initiate a Return
            </h2>
            <p>
              To start a return process, please contact our customer support
              team within 3 days of receiving your order. Provide your order
              number and the reason for the return. Our team will guide you
              through the next steps for sending the product back to us.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Contact Us
            </h2>
            <p>
              If you have any questions about our return policy, please do not
              hesitate to contact us. We are here to ensure your shopping
              experience is a great one.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReturnPolicy;