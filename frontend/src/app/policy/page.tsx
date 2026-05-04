import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import PolicyToc from "./PolicyToc";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Policy | Artisan Barber",
  description:
    "Artisan Barber policies, including privacy, terms of service, refunds, and safe shopping information.",
};

const tocItems = [
  { href: "#section1", label: "Shop with Confidence" },
  { href: "#section2", label: "Privacy Policy" },
  { href: "#section3", label: "Terms of Service" },
  { href: "#section4", label: "Refund Policy" },
];

export default function PolicyPage() {
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Policy</h1>
          <p className={styles.lastUpdated}>Last updated November 14, 2025</p>
          <p>
            Safe shopping, privacy, terms of service, and refund information for
            Artisan Barber.
          </p>
        </header>

        <div className={styles.container}>
          <PolicyToc items={tocItems} />

          <article className={styles.content}>
            <h2 id="section1">Shop with Confidence</h2>
            <p>
              <strong>PROTECTION AGAINST CREDIT CARD FRAUD:</strong>
            </p>
            <p>
              Shopping on artisanbarber.com is safe. Every credit card purchase
              is covered by our Safe Shopping Guarantee:
            </p>
            <p>
              1. Under the Fair Credit Billing Act, your bank cannot hold you
              liable for more than $50.00 of fraudulent charges. If your bank
              holds you liable for any of this $50.00, we will cover the
              liability for you, up to the full $50.00. We will only cover this
              liability if the unauthorized use of your credit card resulted
              through no fault of your own from purchases made on our website
              while using the secure server.
            </p>
            <p>
              2. In the event of unauthorized use of your credit card, you must
              notify your credit card provider in accordance with its reporting
              rules and procedures.
            </p>
            <p>
              <strong>SHOP SAFELY AND SECURELY:</strong>
            </p>
            <p>
              artisanbarber.com takes great pride in offering a safe and secure
              online shopping experience.
            </p>
            <p>
              We understand that the safety of your personal information is
              extremely important to you. We use a wide array of electronic and
              physical security measures and devices to protect your personal
              data and credit card information from unauthorized access.
            </p>
            <p>
              <strong>1. SECURE SOCKETS LAYER (SSL TECHNOLOGY)</strong>
            </p>
            <p>
              artisanbarber.com uses Secure Sockets Layer (SSL) technology to
              provide you with a safe and secure shopping experience possible.
              SSL technology enables encryption of sensitive information,
              including passwords and credit card numbers, during your online
              transactions. All of the forms on our site are secured with SSL
              technology so your personal information stays safe and out of
              malicious hands.
            </p>
            <p>
              <strong>2. VERISIGN</strong>
            </p>
            <p>
              VeriSign, Inc. is a technology company that specializes in data
              encryption and e-commerce. It is one of the most recognized
              companies for certifying that a website is secure and encrypted.
              With VeriSign, you can feel confident shopping on our website!
            </p>
            <p>
              <strong>3. PRIVACY POLICY</strong>
            </p>
            <p>
              artisanbarber.com does not rent, sell or share your personal
              information with anyone. Our Privacy Policy details how your
              personal information is collected and how your personal
              information may be used.
            </p>

            <h2 id="section2">Privacy Policy</h2>
            <PolicyPrivacy />

            <h2 id="section3">Terms of Service</h2>
            <PolicyTerms />

            <h2 id="section4">Refund Policy</h2>
            <PolicyRefund />
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

function PolicyPrivacy() {
  return (
    <>
      <p>
        <strong>SECTION 1 - WHAT DO WE DO WITH YOUR INFORMATION?</strong>
      </p>
      <p>
        When you purchase something from our store, as part of the buying and
        selling process, we collect the personal information you give us such as
        your name, address and email address. When you browse our store, we also
        automatically receive your computer&apos;s internet protocol (IP)
        address in order to provide us with information that helps us learn
        about your browser and operating system.
      </p>
      <p>
        Email marketing (if applicable): With your permission, we may send you
        emails about our store, new products and other updates.
      </p>
      <p>
        <strong>SECTION 2 - CONSENT</strong>
      </p>
      <p>
        When you provide us with personal information to complete a transaction,
        verify your credit card, place an order, arrange for a delivery or
        return a purchase, we imply that you consent to our collecting it and
        using it for that specific reason only.
      </p>
      <p>
        If we ask for your personal information for a secondary reason, like
        marketing, we will either ask you directly for your expressed consent,
        or provide you with an opportunity to say no.
      </p>
      <p>
        <strong>How do I withdraw my consent?</strong>
      </p>
      <p>
        If after you opt-in, you change your mind, you may withdraw your
        consent for us to contact you, for the continued collection, use or
        disclosure of your information, at anytime, by contacting us at
        artisanbarber@gmail.com or mailing us at:
      </p>
      <p>
        Artisan Barber
        <br />
        331 East 81st Street
        <br />
        New York, New York US 10028
      </p>
      <p>
        <strong>SECTION 3 - DISCLOSURE</strong>
      </p>
      <p>
        We may disclose your personal information if we are required by law to
        do so or if you violate our Terms of Service.
      </p>
      <p>
        <strong>SECTION 4 - SHOPIFY</strong>
      </p>
      <p>
        Our store is hosted on Shopify Inc. They provide us with the online
        e-commerce platform that allows us to sell our products and services to
        you. Your data is stored through Shopify&apos;s data storage, databases
        and the general Shopify application. They store your data on a secure
        server behind a firewall.
      </p>
      <p>
        <strong>Payment</strong>
      </p>
      <p>
        If you choose a direct payment gateway to complete your purchase, then
        Shopify stores your credit card data. It is encrypted through the
        Payment Card Industry Data Security Standard (PCI-DSS). Your purchase
        transaction data is stored only as long as is necessary to complete your
        purchase transaction. After that is complete, your purchase transaction
        information is deleted.
      </p>
      <p>
        All direct payment gateways adhere to the standards set by PCI-DSS as
        managed by the PCI Security Standards Council, which is a joint effort
        of brands like Visa, Mastercard, American Express and Discover.
      </p>
      <p>
        For more insight, you may also want to read{" "}
        <a href="https://www.shopify.com/legal/terms">
          Shopify&apos;s Terms of Service
        </a>{" "}
        or{" "}
        <a href="https://www.shopify.com/legal/privacy">Privacy Statement</a>.
      </p>
      <p>
        <strong>SECTION 5 - THIRD-PARTY SERVICES</strong>
      </p>
      <p>
        In general, the third-party providers used by us will only collect, use
        and disclose your information to the extent necessary to allow them to
        perform the services they provide to us.
      </p>
      <p>
        However, certain third-party service providers, such as payment gateways
        and other payment transaction processors, have their own privacy
        policies in respect to the information we are required to provide to
        them for your purchase-related transactions. For these providers, we
        recommend that you read their privacy policies so you can understand the
        manner in which your personal information will be handled by these
        providers.
      </p>
      <p>
        Once you leave our store&apos;s website or are redirected to a
        third-party website or application, you are no longer governed by this
        Privacy Policy or our website&apos;s Terms of Service.
      </p>
      <p>
        <strong>SECTION 6 - SECURITY</strong>
      </p>
      <p>
        To protect your personal information, we take reasonable precautions and
        follow industry best practices to make sure it is not inappropriately
        lost, misused, accessed, disclosed, altered or destroyed.
      </p>
      <p>
        If you provide us with your credit card information, the information is
        encrypted using secure socket layer technology (SSL) and stored with a
        AES-256 encryption. Although no method of transmission over the Internet
        or electronic storage is 100% secure, we follow all PCI-DSS requirements
        and implement additional generally accepted industry standards.
      </p>
      <p>
        <strong>SECTION 7 - COOKIES</strong>
      </p>
      <p>
        Here is a list of cookies that we use. We&apos;ve listed them here so
        that you can choose if you want to opt-out of cookies or not.
      </p>
      <p>
        <strong>1. _session_id</strong>
        <br />
        <strong>- Type:</strong> Unique token, sessional
        <br />
        <strong>- Purpose:</strong> Allows Shopify to store information about
        your session.
      </p>
      <p>
        <strong>2. _shopify_visit</strong>
        <br />
        <strong>- Type:</strong> No data held, persistent
        <br />
        <strong>- Purpose:</strong> Used by our website provider&apos;s
        internal stats tracker to record the number of visits.
      </p>
      <p>
        <strong>3. _shopify_uniq</strong>
        <br />
        <strong>- Type:</strong> No data held, expires
        <br />
        <strong>- Purpose:</strong> Counts the number of visits to a store by a
        single customer.
      </p>
      <p>
        <strong>4. cart</strong>
        <br />
        <strong>- Type:</strong> Unique token, persistent
        <br />
        <strong>- Purpose:</strong> Stores information about the contents of
        your cart.
      </p>
      <p>
        <strong>5. _secure_session_id</strong>
        <br />
        <strong>- Type:</strong> Unique token, sessional
      </p>
      <p>
        <strong>6. storefront_digest</strong>
        <br />
        <strong>- Type:</strong> Unique token, indefinite
        <br />
        <strong>- Purpose:</strong> If the shop has a password, this is used to
        determine if the current visitor has access.
      </p>
      <p>
        <strong>SECTION 8 - AGE OF CONSENT</strong>
      </p>
      <p>
        By using this site, you represent that you are at least the age of
        majority in your state or province of residence, or that you are the age
        of majority in your state or province of residence and you have given us
        your consent to allow any of your minor dependents to use this site.
      </p>
      <p>
        <strong>SECTION 9 - CHANGES TO THIS PRIVACY POLICY</strong>
      </p>
      <p>
        We reserve the right to modify this privacy policy at any time, so
        please review it frequently. Changes and clarifications will take effect
        immediately upon their posting on the website.
      </p>
      <p>
        <strong>QUESTIONS AND CONTACT INFORMATION</strong>
      </p>
      <p>
        If you would like to access, correct, amend or delete any personal
        information we have about you, register a complaint, or simply want more
        information, contact our Privacy Compliance Officer at
        artisanbarber@gmail.com or by mail at:
      </p>
      <p>
        Artisan Barber
        <br />
        [Re: Privacy Compliance Officer]
        <br />
        331 East 81st Street
        <br />
        New York, New York US 10028
      </p>
    </>
  );
}

function PolicyTerms() {
  const terms = [
    {
      title: "OVERVIEW",
      body: [
        "This website is operated by Artisan Barber. Throughout the site, the terms \"we\", \"us\" and \"our\" refer to Artisan Barber. Artisan Barber offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.",
        "By visiting our site and/or purchasing something from us, you engage in our Service and agree to be bound by these Terms of Service, including additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site.",
        "Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service.",
        "Any new features or tools added to the current store shall also be subject to the Terms of Service. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website.",
        "Our store is hosted on Shopify Inc. They provide us with the online e-commerce platform that allows us to sell our products and services to you.",
      ],
    },
    {
      title: "SECTION 1 - ONLINE STORE TERMS",
      body: [
        "By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you have given us your consent to allow any of your minor dependents to use this site.",
        "You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction.",
        "You must not transmit any worms or viruses or any code of a destructive nature.",
        "A breach or violation of any of the Terms will result in an immediate termination of your Services.",
      ],
    },
    {
      title: "SECTION 2 - GENERAL CONDITIONS",
      body: [
        "We reserve the right to refuse service to anyone for any reason at any time.",
        "You understand that your content, not including credit card information, may be transferred unencrypted and involve transmissions over various networks and changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.",
        "You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without express written permission by us.",
        "The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.",
      ],
    },
    {
      title: "SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION",
      body: [
        "We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon as the sole basis for making decisions.",
        "This site may contain certain historical information. Historical information is not current and is provided for your reference only. We reserve the right to modify the contents of this site at any time.",
      ],
    },
    {
      title: "SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES",
      body: [
        "Prices for our products are subject to change without notice.",
        "We reserve the right at any time to modify or discontinue the Service without notice at any time.",
        "We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.",
      ],
    },
    {
      title: "SECTION 5 - PRODUCTS OR SERVICES",
      body: [
        "Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.",
        "We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.",
        "We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region or jurisdiction, and to limit the quantities of any products or services that we offer.",
        "We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations.",
      ],
    },
    {
      title: "SECTION 6 - ACCURACY OF BILLING AND ACCOUNT INFORMATION",
      body: [
        "We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.",
        "You agree to provide current, complete and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information so that we can complete your transactions and contact you as needed.",
        "For more detail, please review our Returns Policy.",
      ],
    },
    {
      title: "SECTION 7 - OPTIONAL TOOLS",
      body: [
        "We may provide you with access to third-party tools over which we neither monitor nor have any control nor input.",
        "You acknowledge and agree that we provide access to such tools as is and as available without any warranties, representations or conditions of any kind and without any endorsement.",
        "Any use by you of optional tools offered through the site is entirely at your own risk and discretion.",
      ],
    },
    {
      title: "SECTION 8 - THIRD-PARTY LINKS",
      body: [
        "Certain content, products and services available via our Service may include materials from third-parties.",
        "Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy.",
        "We are not liable for any harm or damages related to transactions made in connection with third-party websites. Complaints, claims, concerns, or questions regarding third-party products should be directed to the third-party.",
      ],
    },
    {
      title: "SECTION 9 - USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS",
      body: [
        "If you send creative ideas, suggestions, proposals, plans, or other materials, you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us.",
        "We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion is unlawful, offensive, threatening, libelous, defamatory, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Service.",
        "You agree that your comments will not violate any right of any third-party and will not contain unlawful, abusive or obscene material, or any computer virus or malware.",
      ],
    },
    {
      title: "SECTION 10 - PERSONAL INFORMATION",
      body: [
        "Your submission of personal information through the store is governed by our Privacy Policy.",
      ],
    },
    {
      title: "SECTION 11 - ERRORS, INACCURACIES AND OMISSIONS",
      body: [
        "Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if information is inaccurate at any time without prior notice.",
        "We undertake no obligation to update, amend or clarify information in the Service or on any related website, except as required by law.",
      ],
    },
    {
      title: "SECTION 12 - PROHIBITED USES",
      body: [
        "In addition to other prohibitions set forth in the Terms of Service, you are prohibited from using the site or its content for any unlawful purpose, to solicit unlawful acts, to violate regulations or laws, to infringe intellectual property rights, to harass or discriminate, to submit false information, to upload malicious code, to collect personal information, to spam or scrape, for obscene purposes, or to interfere with security features.",
        "We reserve the right to terminate your use of the Service or any related website for violating any prohibited uses.",
      ],
    },
    {
      title: "SECTION 13 - DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY",
      body: [
        "We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free.",
        "You expressly agree that your use of, or inability to use, the service is at your sole risk. The service and all products and services delivered through the service are provided as is and as available, without any representation, warranties or conditions of any kind.",
        "In no case shall Artisan Barber, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.",
      ],
    },
    {
      title: "SECTION 14 - INDEMNIFICATION",
      body: [
        "You agree to indemnify, defend and hold harmless Artisan Barber and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees from any claim or demand made by any third-party due to or arising out of your breach of these Terms of Service.",
      ],
    },
    {
      title: "SECTION 15 - SEVERABILITY",
      body: [
        "If any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed severed from these Terms of Service.",
      ],
    },
    {
      title: "SECTION 16 - TERMINATION",
      body: [
        "The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes.",
        "These Terms of Service are effective unless and until terminated by either you or us.",
        "If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of these Terms of Service, we may terminate this agreement at any time without notice.",
      ],
    },
    {
      title: "SECTION 17 - ENTIRE AGREEMENT",
      body: [
        "The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision.",
        "These Terms of Service and any policies or operating rules posted by us on this site constitute the entire agreement and understanding between you and us and govern your use of the Service.",
      ],
    },
    {
      title: "SECTION 18 - GOVERNING LAW",
      body: [
        "These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of HJR-192 and Public Law 7310.",
      ],
    },
    {
      title: "SECTION 19 - CHANGES TO TERMS OF SERVICE",
      body: [
        "You can review the most current version of the Terms of Service at any time at this page.",
        "We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website.",
      ],
    },
    {
      title: "SECTION 20 - CONTACT INFORMATION",
      body: ["Questions about the Terms of Service should be sent to us at artisanbarber@gmail.com."],
    },
  ];

  return (
    <>
      {terms.map((section) => (
        <section key={section.title} className={styles.policySection}>
          <p>
            <strong>{section.title}</strong>
          </p>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </>
  );
}

function PolicyRefund() {
  return (
    <>
      <p>Returns</p>
      <p>
        Our policy lasts 30 days. If 30 days have gone by since your purchase,
        unfortunately we can&apos;t offer you a refund or exchange. To be
        eligible for a return, your item must be unused and in the same
        condition that you received it. It must also be in the original
        packaging. To complete your return, we require a receipt or proof of
        purchase.
      </p>
      <p>
        <strong>Refunds (if applicable)</strong>
      </p>
      <p>
        Once your return is received and inspected, we will send you an email to
        notify you that we have received your returned item. We will also notify
        you of the approval or rejection of your refund. If you are approved,
        then your refund will be processed, and a credit will automatically be
        applied to your credit card or original method of payment, within a
        certain amount of days.
      </p>
      <p>
        <strong>Late or missing refunds (if applicable)</strong>
      </p>
      <p>
        If you haven&apos;t received a refund yet, first check your bank account
        again. Then contact your credit card company, it may take some time
        before your refund is officially posted.
      </p>
      <p>
        Next contact your bank. There is often some processing time before a
        refund is posted. If you&apos;ve done all of this and you still have not
        received your refund yet, please contact us at artisanbarber@gmail.com.
      </p>
      <p>
        <strong>Sale items (if applicable)</strong>
      </p>
      <p>
        Only regular priced items may be refunded, unfortunately sale items
        cannot be refunded. Exchanges only replace items if they are defective
        or damaged. If you need to exchange it for the same item, send us an
        email at artisanbarber@gmail.com and send your item to:
      </p>
      <p>
        331 East 81st Street
        <br />
        New York, New York US 10028
      </p>
      <p>
        <strong>Gifts</strong>
      </p>
      <p>
        If the item was marked as a gift when purchased and shipped directly to
        you, you&apos;ll receive a gift credit for the value of your return.
        Once the returned item is received, a gift certificate will be mailed to
        you. If the item wasn&apos;t marked as a gift when purchased, or the
        gift giver had the order shipped to themselves to give to you later, we
        will send a refund to the gift giver.
      </p>
      <p>
        <strong>Shipping</strong>
      </p>
      <p>To return your product, you should mail your product to:</p>
      <p>
        331 East 81st
        <br />
        New York, New York US 10028
      </p>
      <p>
        You will be responsible for paying for your own shipping costs for
        returning your item. Shipping costs are non-refundable. If you receive a
        refund, the cost of return shipping will be deducted from your refund.
      </p>
      <p>
        Depending on where you live, the time it may take for your exchanged
        product to reach you may vary.
      </p>
      <p>
        If you are shipping an item over $75, you should consider using a
        trackable shipping service or purchasing shipping insurance. We
        don&apos;t guarantee that we will receive your returned item.
      </p>
    </>
  );
}
