/* @ds-bundle: {"format":4,"namespace":"WellnessByPhysiatryDesignSystem_ddd774","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"ConditionTag","sourcePath":"components/core/ConditionTag.jsx"},{"name":"ContactCard","sourcePath":"components/marketing/ContactCard.jsx"},{"name":"FAQItem","sourcePath":"components/marketing/FAQItem.jsx"},{"name":"SectionHeading","sourcePath":"components/marketing/SectionHeading.jsx"},{"name":"ServiceCard","sourcePath":"components/marketing/ServiceCard.jsx"},{"name":"TeamCard","sourcePath":"components/marketing/TeamCard.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"About","sourcePath":"ui_kits/website/About.jsx"},{"name":"Contact","sourcePath":"ui_kits/website/Contact.jsx"},{"name":"Home","sourcePath":"ui_kits/website/Home.jsx"},{"name":"Services","sourcePath":"ui_kits/website/Services.jsx"}],"sourceHashes":{"components/core/Button.jsx":"d8d2649dc00e","components/core/ConditionTag.jsx":"33bf341cf600","components/marketing/ContactCard.jsx":"ca74650b23cb","components/marketing/FAQItem.jsx":"415131d07d9e","components/marketing/SectionHeading.jsx":"bda627765c7d","components/marketing/ServiceCard.jsx":"56a01b6cff7a","components/marketing/TeamCard.jsx":"9ff31a0f8bdf","components/navigation/Footer.jsx":"d90669fd1541","components/navigation/NavBar.jsx":"3bd71c084a12","ui_kits/website/About.jsx":"ec2ad78c9b07","ui_kits/website/Contact.jsx":"57d776f3f101","ui_kits/website/Home.jsx":"1ad57cd24cb5","ui_kits/website/Services.jsx":"16bc46a08d69"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.WellnessByPhysiatryDesignSystem_ddd774 = window.WellnessByPhysiatryDesignSystem_ddd774 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled
}) {
  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    borderRadius: 'var(--radius-pill)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)',
    opacity: disabled ? 0.5 : 1,
    textDecoration: 'none'
  };
  const sizes = {
    sm: {
      padding: '8px 18px',
      fontSize: 14
    },
    md: {
      padding: '12px 28px',
      fontSize: 15
    },
    lg: {
      padding: '16px 36px',
      fontSize: 16.5
    }
  };
  const variants = {
    primary: {
      background: 'var(--color-forest-700)',
      color: 'var(--text-inverse)'
    },
    secondary: {
      background: 'var(--surface-brand)',
      color: 'var(--text-on-brand)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-forest-700)',
      border: '1px solid var(--border-strong)'
    }
  };
  const style = {
    ...base,
    ...sizes[size],
    ...variants[variant]
  };
  const Tag = href ? 'a' : 'button';
  return React.createElement(Tag, {
    href,
    onClick,
    disabled,
    style,
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/ConditionTag.jsx
try { (() => {
const MAP = {
  tbi: {
    label: 'Traumatic Brain Injury',
    img: 'leaf-tbi.avif',
    bg: 'var(--condition-tbi-bg)'
  },
  stroke: {
    label: 'Stroke',
    img: 'leaf-stroke.avif',
    bg: 'var(--condition-stroke-bg)'
  },
  concussion: {
    label: 'Concussion',
    img: 'leaf-concussion.avif',
    bg: 'var(--condition-concussion-bg)'
  },
  cognitive: {
    label: 'Cognitive Changes',
    img: 'leaf-cognitive.avif',
    bg: 'var(--condition-cognitive-bg)'
  },
  neurobehavioral: {
    label: 'Neurobehavioral Changes',
    img: 'leaf-neurobehavioral.avif',
    bg: 'var(--condition-neurobehavioral-bg)'
  }
};
function ConditionTag({
  condition,
  description,
  assetBase = '/assets/conditions/'
}) {
  const c = MAP[condition] || MAP.tbi;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 12,
      maxWidth: 200,
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 84,
      height: 84,
      borderRadius: '50%',
      background: c.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: assetBase + c.img,
    alt: c.label,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      color: 'var(--text-primary)'
    }
  }, c.label), description && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)',
      lineHeight: 'var(--lh-normal)'
    }
  }, description));
}
Object.assign(__ds_scope, { ConditionTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ConditionTag.jsx", error: String((e && e.message) || e) }); }

// components/marketing/ContactCard.jsx
try { (() => {
function ContactCard({
  label,
  lines = [],
  variant = 'light'
}) {
  const dark = variant === 'dark';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontFamily: 'var(--font-body)',
      color: dark ? 'var(--text-inverse)' : 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-eyebrow)',
      fontWeight: 700,
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: dark ? 'var(--color-sage-300)' : 'var(--text-brand)'
    }
  }, label), lines.map((l, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      fontSize: 16,
      lineHeight: 'var(--lh-snug)',
      opacity: dark ? 0.9 : 1
    }
  }, l)));
}
Object.assign(__ds_scope, { ContactCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/ContactCard.jsx", error: String((e && e.message) || e) }); }

// components/marketing/FAQItem.jsx
try { (() => {
const {
  useState
} = React;
function FAQItem({
  question,
  answer,
  defaultOpen = false
}) {
  const [open, setOpen] = useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '20px 0',
      textAlign: 'left',
      font: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 19,
      color: 'var(--text-primary)'
    }
  }, question), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      color: 'var(--text-brand)',
      transform: open ? 'rotate(45deg)' : 'none',
      transition: 'transform var(--duration-fast) var(--ease-standard)'
    }
  }, "+")), open && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 20px',
      fontSize: 15.5,
      lineHeight: 'var(--lh-relaxed)',
      color: 'var(--text-secondary)'
    }
  }, answer));
}
Object.assign(__ds_scope, { FAQItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/FAQItem.jsx", error: String((e && e.message) || e) }); }

// components/marketing/SectionHeading.jsx
try { (() => {
function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      textAlign: align,
      alignItems: align === 'center' ? 'center' : 'flex-start',
      maxWidth: 640
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-eyebrow)',
      fontWeight: 700,
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--text-brand)'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h2)',
      fontWeight: 500,
      lineHeight: 'var(--lh-tight)',
      margin: 0,
      color: 'var(--text-primary)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-body-lg)',
      lineHeight: 'var(--lh-normal)',
      color: 'var(--text-secondary)',
      margin: 0
    }
  }, subtitle));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/marketing/ServiceCard.jsx
try { (() => {
function ServiceCard({
  image,
  title,
  description,
  href = '#',
  ctaLabel = 'See More'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      maxWidth: 320,
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      aspectRatio: '4/5',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h3)',
      fontWeight: 500,
      margin: 0,
      color: 'var(--text-primary)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body)',
      lineHeight: 'var(--lh-normal)',
      color: 'var(--text-secondary)',
      margin: 0,
      flex: 1
    }
  }, description), /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: 'var(--color-forest-700)'
    }
  }, ctaLabel, " \u2192"));
}
Object.assign(__ds_scope, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/ServiceCard.jsx", error: String((e && e.message) || e) }); }

// components/marketing/TeamCard.jsx
try { (() => {
function TeamCard({
  photo,
  name,
  role,
  bio
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start',
      fontFamily: 'var(--font-body)',
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 120,
      height: 150,
      borderRadius: 'var(--radius-arch)',
      overflow: 'hidden',
      flexShrink: 0,
      background: 'var(--surface-brand-soft)'
    }
  }, photo && /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--text-primary)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-brand)'
    }
  }, role), bio && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 'var(--lh-normal)',
      color: 'var(--text-secondary)',
      margin: '6px 0 0'
    }
  }, bio)));
}
Object.assign(__ds_scope, { TeamCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/TeamCard.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
function Footer({
  logo
}) {
  const col = {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  };
  const head = {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 'var(--tracking-eyebrow)',
    textTransform: 'uppercase',
    color: 'var(--color-sage-300)',
    marginBottom: 4
  };
  const link = {
    color: 'var(--text-inverse)',
    opacity: 0.85,
    fontSize: 15
  };
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--surface-dark)',
      color: 'var(--text-inverse)',
      padding: '64px 48px',
      display: 'flex',
      gap: 64,
      fontFamily: 'var(--font-body)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: "Wellness by Physiatry",
    style: {
      height: 64,
      filter: 'brightness(0) invert(1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("span", {
    style: head
  }, "Learn"), /*#__PURE__*/React.createElement("a", {
    style: link,
    href: "#"
  }, "Resources"), /*#__PURE__*/React.createElement("a", {
    style: link,
    href: "#"
  }, "Contact")), /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("span", {
    style: head
  }, "Company"), /*#__PURE__*/React.createElement("a", {
    style: link,
    href: "#"
  }, "About"), /*#__PURE__*/React.createElement("a", {
    style: link,
    href: "#"
  }, "Services")), /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("span", {
    style: head
  }, "Connect"), /*#__PURE__*/React.createElement("a", {
    style: link,
    href: "#"
  }, "Instagram"), /*#__PURE__*/React.createElement("a", {
    style: link,
    href: "#"
  }, "Facebook"), /*#__PURE__*/React.createElement("a", {
    style: link,
    href: "#"
  }, "LinkedIn")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      fontSize: 13,
      opacity: 0.6,
      alignSelf: 'flex-end'
    }
  }, "\xA9 2026 All Rights Reserved"));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function NavBar({
  logo,
  links = [],
  ctaLabel = 'Get Started',
  ctaHref = '#'
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 48px',
      fontFamily: 'var(--font-body)',
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: "Wellness by Physiatry",
    style: {
      height: 56
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 32
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href,
    style: {
      color: 'var(--text-primary)',
      fontWeight: 600,
      fontSize: 15
    }
  }, l.label))), /*#__PURE__*/React.createElement("a", {
    href: ctaHref,
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 14,
      padding: '10px 24px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--color-forest-700)',
      color: 'var(--text-inverse)'
    }
  }, ctaLabel));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/About.jsx
try { (() => {
function About({
  N
}) {
  const {
    NavBar,
    Footer,
    SectionHeading,
    TeamCard
  } = N;
  const wrap = {
    maxWidth: 900,
    margin: '0 auto',
    padding: '96px 48px',
    display: 'flex',
    flexDirection: 'column',
    gap: 40
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    logo: "../../assets/logo/wbp-umbrella-logo.png",
    links: [{
      label: 'About Us',
      href: '#about'
    }, {
      label: 'Our Services',
      href: '#services'
    }, {
      label: 'Patient Resources',
      href: '#'
    }, {
      label: 'Contact',
      href: '#contact'
    }]
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-brand-soft)',
      padding: '72px 48px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 'var(--text-h1)',
      maxWidth: 760,
      margin: '0 auto'
    }
  }, "Dedicated to Your Recovery Journey and Long-Lasting Results")), /*#__PURE__*/React.createElement("section", {
    style: wrap
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Our Story",
    title: "Towards Autonomy and a Better Patient Experience"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 'var(--lh-relaxed)',
      color: 'var(--text-secondary)'
    }
  }, "Welcome to Wellness by Physiatry. I'm Dr Kopp, I founded Wellness By Physiatry to provide the best care available for brain injury survivors and their families. Our body doesn't work in separate parts, and neither should your health. That's why I left the hospital setting to be your quarterback during your recovery journey."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 'var(--lh-relaxed)',
      color: 'var(--text-secondary)'
    }
  }, "Wellness by Physiatry is a Chicago-based clinic dedicated to delivering care that is unique to you. The umbrella in our logo means that we are all connected, and so are your symptoms. We are here to join you in your wellness journey."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(TeamCard, {
    photo: "../../assets/photography/caregiver-and-patient.avif",
    name: "Dr. Kopp",
    role: "Founder & Physiatrist",
    bio: "Physical Medicine and Rehabilitation physician specializing in Brain Injury Rehabilitation Medicine; formerly led patient care at TIRR Memorial Hermann and Schwab Rehabilitation Hospital."
  }), /*#__PURE__*/React.createElement(TeamCard, {
    photo: "../../assets/photography/couple-unpacking.avif",
    name: "Veronica",
    role: "Clinic Coordinator",
    bio: "Twenty years of hospital experience, bringing organizational strength and a compassionate touch to daily operations."
  }))), /*#__PURE__*/React.createElement(Footer, {
    logo: "../../assets/logo/wbp-umbrella-logo.png"
  }));
}
Object.assign(__ds_scope, { About });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/About.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Contact.jsx
try { (() => {
function Contact({
  N
}) {
  const {
    NavBar,
    Footer,
    ContactCard,
    Button
  } = N;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    logo: "../../assets/logo/wbp-umbrella-logo.png",
    links: [{
      label: 'About Us',
      href: '#about'
    }, {
      label: 'Our Services',
      href: '#services'
    }, {
      label: 'Patient Resources',
      href: '#'
    }, {
      label: 'Contact',
      href: '#contact'
    }]
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1000,
      margin: '0 auto',
      padding: '96px 48px',
      display: 'flex',
      flexDirection: 'column',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 'var(--text-h1)',
      margin: 0
    }
  }, "Begin Your Health Journey Today"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      color: 'var(--text-secondary)',
      maxWidth: 600,
      margin: 0
    }
  }, "We are ready to partner with you on your path to recovery. Contact us today to schedule your first visit, ask any questions about our services, or discuss a referral."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Request an Appointment")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 40,
      marginTop: 24,
      paddingTop: 40,
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(ContactCard, {
    label: "Email",
    lines: ['fabiollakoppMD@wellnessbyphysiatry.com']
  }), /*#__PURE__*/React.createElement(ContactCard, {
    label: "Phone",
    lines: ['(773) 312-4423']
  }), /*#__PURE__*/React.createElement(ContactCard, {
    label: "Downtown Office",
    lines: ['30 N Michigan Ave, Chicago, IL 60602']
  }), /*#__PURE__*/React.createElement(ContactCard, {
    label: "North Side Office",
    lines: ['2555 N Southport Ave, Chicago, IL 60614']
  }), /*#__PURE__*/React.createElement(ContactCard, {
    label: "Downtown Transit",
    lines: ['Red Line to Lake/Washington', 'Green Line to Washington/Wabash']
  }), /*#__PURE__*/React.createElement(ContactCard, {
    label: "North Side Transit",
    lines: ['Red Line to Fullerton', '74 Bus to Fullerton & Southport']
  }))), /*#__PURE__*/React.createElement(Footer, {
    logo: "../../assets/logo/wbp-umbrella-logo.png"
  }));
}
Object.assign(__ds_scope, { Contact });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
function Home({
  N
}) {
  const {
    NavBar,
    Footer,
    SectionHeading,
    ServiceCard,
    ConditionTag,
    Button
  } = N;
  const wrap = {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 48px'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    logo: "../../assets/logo/wbp-umbrella-logo.png",
    links: [{
      label: 'About Us',
      href: '#about'
    }, {
      label: 'Our Services',
      href: '#services'
    }, {
      label: 'Patient Resources',
      href: '#'
    }, {
      label: 'Contact',
      href: '#contact'
    }]
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-brand-soft)',
      padding: '80px 48px',
      display: 'flex',
      alignItems: 'center',
      gap: 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-eyebrow)',
      fontWeight: 700,
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--text-brand)'
    }
  }, "Wellness by Physiatry"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 'var(--text-hero)',
      lineHeight: 'var(--lh-tight)',
      margin: 0,
      color: 'var(--text-primary)'
    }
  }, "Healing for Your Brain and Body with Respect, Care, and Hope"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-lg)',
      color: 'var(--text-secondary)',
      maxWidth: 480,
      margin: 0
    }
  }, "Specialist Physiatry and Brain Injury Rehabilitation in Chicago."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Get Started"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      aspectRatio: '4/5',
      borderRadius: 'var(--radius-arch)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/photography/couple-lakeside.jpg",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      padding: '96px 48px',
      display: 'flex',
      flexDirection: 'column',
      gap: 48
    },
    id: "about"
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Who We Help",
    title: "We help adults, caregivers, and families who are healing after brain injury.",
    align: "left"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 32
    }
  }, [['Medical Expertise', 'Specialized treatment for brain injuries and neurological disorders such as dementia.'], ['Culturally Competent Care', 'Fluent in English, Spanish, and Português.'], ['Lifestyle Medicine', 'Sleep, nutrition, exercise, and more, tailored to you.']].map(([t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h3)',
      margin: 0
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--text-secondary)',
      fontSize: 15
    }
  }, d))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-card)',
      padding: '96px 48px'
    },
    id: "services"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Our Services",
    title: "Comprehensive Neurological Evaluations and Holistic Care",
    subtitle: "We offer a variety of services based on your unique needs and goals.",
    align: "center"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(ServiceCard, {
    image: "../../assets/photography/couple-lakeside.jpg",
    title: "Brain Injury Rehabilitation",
    description: "A team of specialists work together to help you regain strength, independence, and daily function.",
    href: "#services"
  }), /*#__PURE__*/React.createElement(ServiceCard, {
    image: "../../assets/photography/friends-embrace.avif",
    title: "Lifestyle Medicine",
    description: "A personal health plan that fits your culture, habits, and daily life, with coaching for realistic change.",
    href: "#services"
  }), /*#__PURE__*/React.createElement(ServiceCard, {
    image: "../../assets/photography/couple-breakfast.avif",
    title: "Group Sessions",
    description: "Safe, supportive groups where you can share, learn, and connect, in English, Espa\xF1ol, and Portugu\xEAs.",
    href: "#services"
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 48px',
      background: 'var(--surface-brand-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Common Conditions",
    title: "We treat the following conditions",
    align: "center"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(ConditionTag, {
    condition: "tbi",
    description: "A sudden impact to the head that causes damage to the brain.",
    assetBase: "../../assets/conditions/"
  }), /*#__PURE__*/React.createElement(ConditionTag, {
    condition: "stroke",
    description: "A lack of blood flow to certain parts of the brain.",
    assetBase: "../../assets/conditions/"
  }), /*#__PURE__*/React.createElement(ConditionTag, {
    condition: "concussion",
    description: "Headaches, blurred vision, or problems concentrating.",
    assetBase: "../../assets/conditions/"
  }), /*#__PURE__*/React.createElement(ConditionTag, {
    condition: "cognitive",
    description: "An inability to think, learn, remember, or make decisions.",
    assetBase: "../../assets/conditions/"
  }), /*#__PURE__*/React.createElement(ConditionTag, {
    condition: "neurobehavioral",
    description: "Changes in feelings and moods after a brain injury.",
    assetBase: "../../assets/conditions/"
  })))), /*#__PURE__*/React.createElement(Footer, {
    logo: "../../assets/logo/wbp-umbrella-logo.png"
  }));
}
Object.assign(__ds_scope, { Home });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Services.jsx
try { (() => {
function Services({
  N
}) {
  const {
    NavBar,
    Footer,
    SectionHeading,
    ServiceCard
  } = N;
  const wrap = {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '96px 48px'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    logo: "../../assets/logo/wbp-umbrella-logo.png",
    links: [{
      label: 'About Us',
      href: '#about'
    }, {
      label: 'Our Services',
      href: '#services'
    }, {
      label: 'Patient Resources',
      href: '#'
    }, {
      label: 'Contact',
      href: '#contact'
    }]
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-brand-soft)',
      padding: '72px 48px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 'var(--text-h1)',
      margin: '0 auto',
      maxWidth: 760
    }
  }, "Specialized Treatment Rooted in Clarity and Compassion")), /*#__PURE__*/React.createElement("section", {
    style: wrap
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Our Services",
    title: "Comprehensive Neurological Evaluations and Holistic Care",
    subtitle: "When you or a loved one faces a brain injury, the path forward should be clear and supportive.",
    align: "center"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement(ServiceCard, {
    image: "../../assets/photography/couple-lakeside.jpg",
    title: "Brain Injury Rehabilitation",
    description: "Medical management of TBI, stroke, anoxic brain injury, concussion, and other brain injuries, maximizing neuroplasticity and long-term functional gains."
  }), /*#__PURE__*/React.createElement(ServiceCard, {
    image: "../../assets/photography/friends-embrace.avif",
    title: "Lifestyle Medicine & Coaching",
    description: "Bridging traditional care with sustainable healthy habits \u2014 sleep, nutrition, stress management, and physical activity."
  }), /*#__PURE__*/React.createElement(ServiceCard, {
    image: "../../assets/photography/couple-breakfast.avif",
    title: "Support Through Shared Experience",
    description: "Culturally competent care, integrated behavioral health, and supportive group sessions in English, Espa\xF1ol, and Portugu\xEAs."
  }), /*#__PURE__*/React.createElement(ServiceCard, {
    image: "../../assets/photography/friends-welcome-home.avif",
    title: "Referrals",
    description: "Trusted connections to specialists, social services, transportation, and support programs."
  }))), /*#__PURE__*/React.createElement(Footer, {
    logo: "../../assets/logo/wbp-umbrella-logo.png"
  }));
}
Object.assign(__ds_scope, { Services });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Services.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.ConditionTag = __ds_scope.ConditionTag;

__ds_ns.ContactCard = __ds_scope.ContactCard;

__ds_ns.FAQItem = __ds_scope.FAQItem;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

__ds_ns.TeamCard = __ds_scope.TeamCard;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.About = __ds_scope.About;

__ds_ns.Contact = __ds_scope.Contact;

__ds_ns.Home = __ds_scope.Home;

__ds_ns.Services = __ds_scope.Services;

})();
