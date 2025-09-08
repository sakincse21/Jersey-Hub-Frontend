const DeliverPolicy = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-center text-3xl font-bold md:mb-12 md:text-4xl">
          Delivery Policy
        </h1>
        <div className="space-y-8 text-muted-foreground">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              1. Order Confirmation & Processing
            </h2>
            <p>
              Once you place an order on our website, you will receive an
              automated confirmation email. This email confirms that we have
              received your order and are beginning to process it. Our team
              works diligently to process all orders within 24 hours of
              confirmation.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              2. Estimated Delivery Time
            </h2>
            <p>
              Your satisfaction is our priority, and we aim to get your products
              to you as quickly as possible. After your order has been
              processed, you can expect to receive it within{" "}
              <strong>3 to 4 business days</strong>. Please note that business
              days do not include weekends or public holidays. While we strive
              to meet this timeline, delivery times may vary slightly based on
              your location and unforeseen courier delays.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              3. Receiving and Inspecting Your Order
            </h2>
            <p>
              We have a "Check and Receive" policy to ensure you are completely
              satisfied with your purchase. We strongly encourage you to inspect
              your product(s) in the presence of the courier delivery person.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Before making the payment</strong> (for Cash on Delivery)
                or before the courier leaves, please open the package and check
                the item.
              </li>
              <li>
                Verify that it is the correct product, size, and color you
                ordered.
              </li>
              <li>
                Check for any physical damage, defects, or faults (e.g., tears,
                stains, printing errors).
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              4. Returning a Faulty Product
            </h2>
            <p>
              If you find that the product is damaged, defective, or not what
              you ordered upon inspection,{" "}
              <strong>please do not accept the delivery</strong>. You have the
              right to return the product immediately to the courier person
              without any charge. Simply hand the package back to them and inform
              them of the issue.
            </p>
            <p>
              Once you have accepted the delivery and the courier has left, this
              on-the-spot return option will no longer be available. For issues
              discovered after delivery, please refer to our{" "}
              <strong>Return & Replacement Policy</strong>.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Contact Us
            </h2>
            <p>
              If you have any questions about your delivery, please do not
              hesitate to contact our customer support team. We are here to
              help!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliverPolicy;