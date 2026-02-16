/* ===================================================
   DRESS ME BY OJ – Main JavaScript
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initHeader();
  initMobileNav();
  initScrollAnimations();
  initBackToTop();
  initChat();
  initLightbox();
  initBlogModals();
  initProductModals();
  initFAQAccordion();
  initSmoothScroll();
  initLanguageSwitcher();
  initCart();
  injectDynamicElements();
});

/* ---------- Header Scroll Effect ---------- */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });
}

/* ---------- Mobile Navigation ---------- */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- Scroll Reveal Animations ---------- */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ---------- Lightbox ---------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  if (!lightbox) return;

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxClose) {
      lightbox.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      lightbox.classList.remove('active');
    }
  });
}

// Called from gallery items
function openLightbox(el) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (!lightbox || !lightboxImg) return;

  const img = el.querySelector('img');
  if (img) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
  }
}

/* ---------- AI Chat Widget ---------- */
function initChat() {
  const chatWidget = document.getElementById('chatWidget');
  const chatToggle = document.getElementById('chatToggle');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');
  const quickReplies = document.getElementById('quickReplies');

  if (!chatWidget || !chatToggle) return;

  // Toggle chat
  chatToggle.addEventListener('click', () => {
    chatWidget.classList.toggle('open');
    if (chatWidget.classList.contains('open') && chatInput) {
      setTimeout(() => chatInput.focus(), 300);
    }
  });

  // Send message
  function sendMessage() {
    if (!chatInput || !chatMessages) return;
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';

    // Hide quick replies after first message
    if (quickReplies) quickReplies.style.display = 'none';

    // Show typing
    showTyping();

    // Bot response
    setTimeout(() => {
      removeTyping();
      const response = getBotResponse(text);
      appendMessage(response, 'bot');
    }, 1000 + Math.random() * 1000);
  }

  if (chatSend) chatSend.addEventListener('click', sendMessage);
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  // Quick replies
  if (quickReplies) {
    quickReplies.querySelectorAll('.quick-reply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const msg = btn.getAttribute('data-msg');
        if (chatInput) chatInput.value = msg;
        sendMessage();
      });
    });
  }
}

function appendMessage(text, type) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;

  const div = document.createElement('div');
  div.className = `chat-message ${type}`;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;

  const div = document.createElement('div');
  div.className = 'chat-message typing';
  div.id = 'typingIndicator';
  div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById('typingIndicator');
  if (typing) typing.remove();
}

const chatResponses = {
  en: {
    greeting: {
      keywords: ['hello', 'hi', 'hey', 'good', 'yo'],
      response: "Hello! 👋 Welcome to Dress Me by Oj! I'm here to help you with product inquiries, orders, sizing, or anything else. What would you like to know?"
    },
    product: {
      keywords: ['product', 'collection', 'clothes', 'clothing', 'offer'],
      response: "We offer a wide range of fashionable clothing including Evening Wear, Casual Wear, Traditional African-inspired pieces, Street Style, Accessories, and Bespoke Tailoring. Visit our Products page to explore our full collection! 👗"
    },
    order: {
      keywords: ['order', 'buy', 'purchase'],
      response: "To place an order, you can:\n📞 Call us: 0836982296\n✉ Email: Dressmeclothing@yahoo.com\nOr fill out the contact form on our Contact page. We'll guide you through the process! 🛍️"
    },
    size: {
      keywords: ['size', 'measurement', 'fit'],
      response: "We offer sizes from XS to 4XL. For the perfect fit, we recommend our bespoke tailoring service where garments are made to your exact measurements. Contact us with your size requirements! 📏"
    },
    shipping: {
      keywords: ['ship', 'deliver', 'shipping'],
      response: "We ship to over 15 countries worldwide! Shipping costs and delivery times vary by location. Contact us at Dressmeclothing@yahoo.com for a shipping quote to your area. 🌍"
    },
    contact: {
      keywords: ['contact', 'phone', 'email', 'reach'],
      response: "You can reach us at:\n📞 Phone: 0836982296\n✉ Email: Dressmeclothing@yahoo.com\nOur business hours are Mon-Sat, 9:00 AM - 6:00 PM. We look forward to hearing from you! 📱"
    },
    price: {
      keywords: ['price', 'cost', 'how much', 'expensive'],
      response: "Our prices vary depending on the item, fabric, and customization. We offer options for every budget while maintaining our luxury quality standards. Contact us for specific pricing! 💰"
    },
    custom: {
      keywords: ['custom', 'bespoke', 'tailor', 'design'],
      response: "Yes, we specialize in bespoke tailoring! Share your design ideas, preferred fabrics, and measurements, and our expert team will create a unique piece just for you. 🪡✨"
    },
    about: {
      keywords: ['about', 'who', 'story', 'brand'],
      response: "Dress Me by Oj is a fast growing clothing brand in Africa, specializing in manufacturing fashionable clothes for the general public. Our vision is to take the world by storm with premium African fashion! 🌟"
    },
    wholesale: {
      keywords: ['wholesale', 'bulk', 'resell', 'retail'],
      response: "We offer wholesale ordering for retailers and distributors! Partner with us to bring Dress Me by Oj fashion to your market. Contact us at Dressmeclothing@yahoo.com for wholesale inquiries. 📦"
    },
    thanks: {
      keywords: ['thank', 'thanks'],
      response: "You're welcome! 😊 If you have any other questions, feel free to ask. We're always here to help. Have a wonderful day! ✨"
    },
    default: "Thank you for your message! For detailed inquiries, please contact us directly at 📞 0836982296 or ✉ Dressmeclothing@yahoo.com. Our team will be happy to assist you! 😊"
  },
  es: {
    greeting: {
      keywords: ['hola', 'buenos', 'buenas', 'hey', 'qué tal'],
      response: "¡Hola! 👋 ¡Bienvenido a Dress Me by Oj! Estoy aquí para ayudarte con consultas sobre productos, pedidos, tallas o cualquier otra cosa. ¿Qué te gustaría saber?"
    },
    product: {
      keywords: ['producto', 'colección', 'ropa', 'vestido', 'oferta'],
      response: "Ofrecemos una amplia gama de ropa de moda que incluye ropa de noche, ropa casual, piezas tradicionales de inspiración africana, estilo callejero, accesorios y sastrería a medida. ¡Visita nuestra página de Productos para explorar nuestra colección completa! 👗"
    },
    order: {
      keywords: ['pedido', 'comprar', 'ordenar', 'adquirir'],
      response: "Para realizar un pedido, puedes:\n📞 Llamarnos: 0836982296\n✉ Correo: Dressmeclothing@yahoo.com\nO completar el formulario de contacto en nuestra página de Contacto. ¡Te guiaremos en el proceso! 🛍️"
    },
    size: {
      keywords: ['talla', 'medida', 'ajuste', 'tamaño'],
      response: "Ofrecemos tallas desde XS hasta 4XL. Para el ajuste perfecto, recomendamos nuestro servicio de sastrería a medida. ¡Contáctanos con tus requisitos de talla! 📏"
    },
    shipping: {
      keywords: ['envío', 'entrega', 'enviar', 'despacho'],
      response: "¡Realizamos envíos a más de 15 países en todo el mundo! Los costos y tiempos de envío varían según la ubicación. Contáctanos para una cotización de envío a tu área. 🌍"
    },
    contact: {
      keywords: ['contacto', 'teléfono', 'correo', 'email', 'llamar'],
      response: "Puedes contactarnos en:\n📞 Teléfono: 0836982296\n✉ Correo: Dressmeclothing@yahoo.com\nNuestro horario de atención es Lun-Sáb, 9:00 AM - 6:00 PM. ¡Esperamos saber de ti! 📱"
    },
    price: {
      keywords: ['precio', 'costo', 'cuánto', 'valor', 'caro'],
      response: "Nuestros precios varían según el artículo, la tela y la personalización. Ofrecemos opciones para cada presupuesto manteniendo nuestros estándares de lujo. ¡Contáctanos para precios específicos! 💰"
    },
    custom: {
      keywords: ['personalizado', 'medida', 'sastre', 'diseño'],
      response: "¡Sí, nos especializamos en sastrería a medida! Comparte tus ideas de diseño, telas preferidas y medidas, y nuestro equipo experto creará una pieza única solo para ti. 🪡✨"
    },
    about: {
      keywords: ['nosotros', 'quién', 'historia', 'marca'],
      response: "Dress Me by Oj es una marca de ropa en rápido crecimiento en África. ¡Nuestra visión es conquistar el mundo con moda africana premium! 🌟"
    },
    wholesale: {
      keywords: ['mayoreo', 'mayorista', 'vender', 'distribuir'],
      response: "¡Ofrecemos pedidos al por mayor para minoristas y distribuidores! Asóciate con nosotros para llevar la moda de Dress Me by Oj a tu mercado. Contáctanos para consultas de mayoreo. 📦"
    },
    thanks: {
      keywords: ['gracias', 'agradecido'],
      response: "¡De nada! 😊 Si tienes alguna otra pregunta, no dudes en preguntar. Siempre estamos aquí para ayudar. ¡Que tengas un día maravilloso! ✨"
    },
    default: "¡Gracias por tu mensaje! Para consultas detalladas, contáctanos directamente al 📞 0836982296 o ✉ Dressmeclothing@yahoo.com. ¡Nuestro equipo estará encantado de ayudarte! 😊"
  },
  ar: {
    greeting: {
      keywords: ['مرحبا', 'هلا', 'سلام', 'أهلا'],
      response: "مرحبًا! 👋 أهلاً بك في Dress Me by Oj! أنا هنا لمساعدتك في الاستفسار عن المنتجات، الطلبات، المقاسات، أو أي شيء آخر. ماذا تود أن تعرف؟"
    },
    product: {
      keywords: ['منتج', 'مجموعة', 'ملابس', 'عرض', 'فستان'],
      response: "نقدم مجموعة واسعة من الملابس العصرية بما في ذلك ملابس السهرة، الملابس الكاجوال، القطع التقليدية المستوحاة من أفريقيا، الإكسسوارات، والتفصيل حسب الطلب. تفضل بزيارة صفحة المنتجات لاستكشاف مجموعتنا الكاملة! 👗"
    },
    order: {
      keywords: ['طلب', 'شراء', 'اطلب'],
      response: "لتقديم طلب، يمكنك:\n📞 الاتصال بنا: 0836982296\n✉ البريد الإلكتروني: Dressmeclothing@yahoo.com\nأو ملء نموذج الاتصال في صفحة اتصل بنا. سنرشدك خلال العملية! 🛍️"
    },
    size: {
      keywords: ['مقاس', 'حجم', 'قياس'],
      response: "نقدم مقاسات من XS إلى 4XL. للمقاس المثالي، نوصي بخدمة التفصيل حسب الطلب حيث يتم صنع الملابس حسب مقاساتك الدقيقة. تواصل معنا بخصوص مقاسك! 📏"
    },
    shipping: {
      keywords: ['شحن', 'توصيل', 'إرسال'],
      response: "نشحن إلى أكثر من 15 دولة حول العالم! تختلف تكاليف الشحن وأوقات التوصيل حسب الموقع. اتصل بنا للحصول على عرض سعر للشحن إلى منطقتك. 🌍"
    },
    contact: {
      keywords: ['تواصل', 'هاتف', 'بريد', 'ايميل', 'اتصال'],
      response: "يمكنك التواصل معنا عبر:\n📞 الهاتف: 0836982296\n✉ البريد: Dressmeclothing@yahoo.com\nساعات العمل من الاثنين للسبت، 9:00 ص - 6:00 م. نتطلع لسماع صوتك! 📱"
    },
    price: {
      keywords: ['سعر', 'تكلفة', 'كم', 'بكام'],
      response: "تختلف أسعارنا حسب القطعة والقماش والتخصيص. نقدم خيارات لكل ميزانية مع الحفاظ على معايير الجودة الفاخرة لدينا. تواصل معنا لمعرفة الأسعار المحددة! 💰"
    },
    custom: {
      keywords: ['تخصيص', 'تفصيل', 'تصميم', 'خاص'],
      response: "نعم، نحن متخصصون في التفصيل حسب الطلب! شاركنا أفكار تصميمك والأقمشة المفضلة والمقاسات، وسيقوم فريقنا الخبير بإنشاء قطعة فريدة خصيصًا لك. 🪡✨"
    },
    about: {
      keywords: ['من', 'قصة', 'علامة', 'نحن'],
      response: "Dress Me by Oj هي علامة تجارية سريعة النمو في أفريقيا. رؤيتنا هي غزو العالم بالأزياء الأفريقية الفاخرة! 🌟"
    },
    wholesale: {
      keywords: ['جملة', 'توزيع', 'تجار', 'كميات'],
      response: "نقدم طلبات الجملة لتجار التجزئة والموزعين! كن شريكًا لنا لجلب أزياء Dress Me by Oj إلى سوقك. تواصل معنا للاستفسار عن الجملة. 📦"
    },
    thanks: {
      keywords: ['شكرا', 'شكر', 'تسلم'],
      response: "عفواً! 😊 إذا كان لديك أي أسئلة أخرى، فلا تتردد في طرحها. نحن هنا دائما للمساعدة. أتمنى لك يوماً رائعاً! ✨"
    },
    default: "شكرًا لرسالتك! للاستفسارات التفصيلية، يرجى الاتصال بنا مباشرة على 📞 0836982296 أو ✉ Dressmeclothing@yahoo.com. سيسعد فريقنا بمساعدتك! 😊"
  }
};

function getBotResponse(input) {
  const text = input.toLowerCase();

  // Get responses for current language, fallback to English
  const langData = chatResponses[currentLang] || chatResponses['en'];

  // Check for keywords
  for (const key in langData) {
    if (key === 'default') continue;

    // Check if any keyword matches
    const keywords = langData[key].keywords;
    if (keywords && keywords.some(word => text.includes(word))) {
      return langData[key].response;
    }
  }

  // Return default response if no match
  return langData.default;
}

/* ---------- Contact Form ---------- */
function handleContactSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('contactName');
  const email = document.getElementById('contactEmail');
  const message = document.getElementById('contactMessage');
  const subject = document.getElementById('contactSubject');
  const phone = document.getElementById('contactPhone');

  if (!name || !email || !message) return;

  // Basic validation
  if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
    alert('Please fill in all required fields.');
    return;
  }

  if (!isValidEmail(email.value)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Show sending state
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerText;
  btn.innerText = 'Sending...';
  btn.disabled = true;

  // Send to FormSubmit.co
  fetch("https://formsubmit.co/ajax/Dressmeclothing@yahoo.com", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      _subject: subject && subject.value ? subject.value : 'New Contact from Website',
      phone: phone ? phone.value : '',
      message: message.value
    })
  })
    .then(response => response.json())
    .then(data => {
      // Show success
      const form = document.getElementById('contactForm');
      const success = document.getElementById('formSuccess');
      if (form) form.style.display = 'none';
      if (success) success.classList.add('visible');

      // Reset after 5 seconds
      setTimeout(() => {
        if (form) {
          form.style.display = 'flex';
          form.reset();
        }
        if (success) success.classList.remove('visible');
        btn.innerText = originalText;
        btn.disabled = false;
      }, 5000);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('There was a problem sending your message. Please try again.');
      btn.innerText = originalText;
      btn.disabled = false;
    });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ---------- Newsletter Subscription ---------- */
function subscribeNewsletter() {
  const email = document.getElementById('newsletterEmail');
  const msg = document.getElementById('newsletterMsg');
  if (!email || !msg) return;

  if (!email.value.trim() || !isValidEmail(email.value)) {
    msg.textContent = 'Please enter a valid email address.';
    msg.style.display = 'block';
    return;
  }

  msg.textContent = '✓ Thank you for subscribing! Stay tuned for fashion updates.';
  msg.style.display = 'block';
  email.value = '';

  setTimeout(() => {
    msg.style.display = 'none';
  }, 4000);
}

/* ---------- Language Switcher ---------- */
const translations = {
  en: {
    // Nav
    nav_home: 'Home', nav_about: 'About Us', nav_products: 'Products',
    nav_gallery: 'Gallery', nav_blog: 'Blog & News', nav_contact: 'Contact Us',
    // Hero
    hero_tagline: 'Crafted in Africa, Worn Worldwide',
    hero_title: 'Redefining <span class="highlight">Fashion</span> with African Elegance',
    hero_desc: 'Dress Me by Oj brings you premium, handcrafted clothing that blends contemporary style with the rich heritage of African craftsmanship.',
    hero_cta1: 'Explore Collection', hero_cta2: 'Our Story', scroll: 'Scroll',
    // Stats
    stat_customers: 'Happy Customers', stat_designs: 'Unique Designs',
    stat_countries: 'Countries Reached', stat_quality: 'Quality Crafted',
    // About
    about_label: 'About Us', about_title: 'Our Story',
    about_vision: '"Our vision is to see our brand take over the world"',
    about_p1: 'Dress Me by Oj is a fast growing clothing brand in Africa, specializing in the manufacturing of fashionable clothes for the general public. We blend traditional African artistry with modern fashion trends to create pieces that are both timeless and contemporary.',
    about_p2: 'Every garment we produce is a testament to our commitment to quality, style, and the rich cultural heritage of Africa.',
    // Features
    feat_quality: 'Premium Quality', feat_quality_desc: 'Finest fabrics sourced globally',
    feat_craft: 'Expert Craftsmanship', feat_craft_desc: 'Skilled artisans in every stitch',
    feat_modern: 'Modern Designs', feat_modern_desc: 'Contemporary African fashion',
    feat_sustain: 'Sustainable Fashion', feat_sustain_desc: 'Eco-conscious manufacturing',
    learn_more: 'Learn More',
    // Products
    products_label: 'Featured Collection', products_title: 'Curated For You',
    products_subtitle: 'Discover our most sought-after pieces, each crafted with meticulous attention to detail and designed to make a statement.',
    tag_new: 'New Arrival', tag_trending: 'Trending', tag_exclusive: 'Exclusive',
    prod_evening: 'Evening Elegance', prod_evening_desc: 'Sophisticated evening wear for unforgettable nights',
    prod_casual: 'Urban Casual', prod_casual_desc: 'Effortless everyday style with African flair',
    prod_heritage: 'Heritage Line', prod_heritage_desc: 'Modern interpretations of timeless African patterns',
    view_all: 'View All Products',
    // CTA
    cta_title: 'Ready to Elevate Your Wardrobe?',
    cta_desc: 'Join thousands of fashion-forward individuals who trust Dress Me by Oj for premium African fashion.',
    cta_btn: 'Get in Touch',
    // Testimonials
    testimonial_label: 'Testimonials', testimonial_title: 'What Our Clients Say',
    test1_text: 'The quality of Dress Me by Oj clothing is exceptional. Every piece I\'ve purchased has been a conversation starter. The blend of African heritage with modern style is truly unique.',
    test1_role: 'Fashion Enthusiast',
    test2_text: 'I\'ve been wearing Dress Me by Oj for two years now. The craftsmanship is impeccable, and I always receive compliments. Their evening wear collection is absolutely stunning.',
    test2_role: 'Loyal Customer',
    test3_text: 'From the fabric quality to the detailed stitching, everything about Dress Me by Oj speaks luxury. They are truly putting African fashion on the global map.',
    test3_role: 'Style Influencer',
    // Footer
    footer_desc: 'A fast growing clothing brand in Africa, specializing in the manufacturing of fashionable clothes for the general public.',
    footer_pages: 'Pages', footer_company: 'Company', footer_contact: 'Contact',
    // Chat
    chat_status: 'Online – Ready to help',
    chat_welcome: 'Hello! 👋 Welcome to Dress Me by Oj. How can I help you today? I can assist you with product inquiries, sizing, orders, or anything else!',
    chat_placeholder: 'Type your message...',
    qr_products: 'Products', qr_order: 'Place an Order', qr_sizes: 'Sizes', qr_contact: 'Contact',
    qr_products_msg: 'What products do you offer?', qr_order_msg: 'How can I place an order?',
    qr_sizes_msg: 'What are your sizes?', qr_contact_msg: 'How to contact you?',
    // Contact
    contact_label: 'Reach Out', page_contact_title: 'Contact <span class="text-gold">Us</span>',
    page_contact_subtitle: "We'd Love to Hear From You",
    getintouch_label: 'Get in Touch', getintouch_title: "Let's Start a Conversation",
    getintouch_desc: "Whether you have a question about our products, need a custom order, or want to explore wholesale opportunities, we're here to help.",
    phone_label: 'Phone', email_label: 'Email', location_label: 'Location',
    location_value: 'Africa', hours_label: 'Business Hours', hours_value: 'Mon - Sat: 9:00 AM - 6:00 PM',
    form_name: 'Your Name', form_email: 'Your Email', form_subject: 'Subject',
    form_phone: 'Phone Number', form_message: 'Message', form_submit: 'Send Message',
    // Blog
    read_more: 'Read More', subscribe_btn: 'Subscribe',
    newsletter_title: 'Stay in the Loop', newsletter_desc: 'Subscribe to our newsletter for the latest fashion updates, exclusive offers, and new collection previews.',

    // Products (New)
    prod_white_tank: "White Tank 'Dress Me'", prod_white_tank_desc: "Signature Script Logo",
    prod_black_long: "Black Long Sleeve 'Dress Me'", prod_black_long_desc: "Signature Circle Logo",
    prod_black_tank: "Black Tank 'Dress Me'", prod_black_tank_desc: "Signature Script Logo",

    // Page - About
    page_about_title: 'ABOUT US',
    story_label: 'Who We Are', story_title: 'Born in Africa, Made for the World',
    story_p1: 'Dress Me by Oj is a fast growing clothing brand in Africa, who specializes in the manufacturing of fashionable clothes for the general public. Founded with a passion for fashion and a deep appreciation for African artistry, we have grown from a small atelier into a brand recognized across multiple countries.',
    story_p2: 'Our designs are inspired by the vibrant cultures, rich textures, and bold colors of Africa, reimagined for the modern, global consumer. We believe that fashion should be both an expression of identity and a bridge between cultures.',
    story_p3: 'Every garment that leaves our workshop carries with it the spirit of innovation, the touch of skilled hands, and the promise of uncompromising quality.',

    // About - Mission
    mv_label: 'Our Purpose', mv_title: 'Mission & Vision',
    mission_heading: 'Our Mission', mission_text: 'To manufacture fashionable, high-quality clothing that empowers individuals to express their unique style while celebrating the richness of African heritage.',
    vision_heading: 'Our Vision', vision_text: 'To see our brand take over the world — becoming the leading African fashion brand recognized globally for innovation, quality, and cultural authenticity.',
    values_heading: 'Our Values', values_text: 'Quality, creativity, integrity, and cultural pride are the cornerstones of everything we do.',

    // About - Timeline
    journey_label: 'Our Journey', journey_title: 'A Legacy in the Making',
    tl1_title: 'The Beginning', tl1_desc: 'Dress Me by Oj was born from a vision to bring premium African fashion to the world.',
    tl2_title: 'First Collection', tl2_desc: 'Our debut collection received an overwhelming response, establishing our signature style.',
    tl3_title: 'Expanding Horizons', tl3_desc: 'We expanded operations, reaching customers across 15+ countries.',
    tl4_title: 'Going Global', tl4_desc: 'Dress Me by Oj continues its journey to become Africa\'s most recognized fashion brand.',

    // About - Team
    team_label: 'Behind the Brand', team_title: 'Meet Our Team', team_subtitle: 'The talented individuals who bring Dress Me by Oj to life every day.',
    team1_name: 'OJ', team1_role: 'Founder & Creative Director', team1_desc: 'The visionary behind Dress Me by Oj, driving innovation and setting the creative direction.',
    team2_name: 'Design Team', team2_role: 'Creative Artisans', team2_desc: 'Our talented design team transforms ideas into stunning garments, blending tradition with modernity.',
    team3_name: 'Production Team', team3_role: 'Master Craftspeople', team3_desc: 'Skilled artisans who ensure every stitch meets our exacting quality standards.',

    // About - CTA
    about_cta_title: 'Join Our Fashion Journey', about_cta_desc: 'Be part of the movement that\'s redefining African fashion for the world.',
  },
  es: {
    nav_home: 'Inicio', nav_about: 'Nosotros', nav_products: 'Productos',
    nav_gallery: 'Galería', nav_blog: 'Blog y Noticias', nav_contact: 'Contacto',
    hero_tagline: 'Hecho en África, Usado en Todo el Mundo',
    hero_title: 'Redefiniendo la <span class="highlight">Moda</span> con Elegancia Africana',
    hero_desc: 'Dress Me by Oj te ofrece ropa premium y artesanal que combina el estilo contemporáneo con la rica herencia de la artesanía africana.',
    hero_cta1: 'Explorar Colección', hero_cta2: 'Nuestra Historia', scroll: 'Desplazar',
    stat_customers: 'Clientes Felices', stat_designs: 'Diseños Únicos',
    stat_countries: 'Países Alcanzados', stat_quality: 'Calidad Artesanal',
    about_label: 'Nosotros', about_title: 'Nuestra Historia',
    about_vision: '"Nuestra visión es ver nuestra marca conquistar el mundo"',
    about_p1: 'Dress Me by Oj es una marca de ropa en rápido crecimiento en África, especializada en la fabricación de ropa de moda para el público en general.',
    about_p2: 'Cada prenda que producimos es un testimonio de nuestro compromiso con la calidad, el estilo y la rica herencia cultural de África.',
    feat_quality: 'Calidad Premium', feat_quality_desc: 'Las mejores telas del mundo',
    feat_craft: 'Artesanía Experta', feat_craft_desc: 'Artesanos en cada puntada',
    feat_modern: 'Diseños Modernos', feat_modern_desc: 'Moda africana contemporánea',
    feat_sustain: 'Moda Sostenible', feat_sustain_desc: 'Fabricación ecoconsciente',
    learn_more: 'Saber Más',
    products_label: 'Colección Destacada', products_title: 'Seleccionados Para Ti',
    products_subtitle: 'Descubre nuestras piezas más buscadas, cada una elaborada con atención al detalle.',
    tag_new: 'Nuevo', tag_trending: 'Tendencia', tag_exclusive: 'Exclusivo',
    prod_evening: 'Elegancia Nocturna', prod_evening_desc: 'Ropa de noche sofisticada',
    prod_casual: 'Casual Urbano', prod_casual_desc: 'Estilo cotidiano con toque africano',
    prod_heritage: 'Línea Herencia', prod_heritage_desc: 'Patrones africanos atemporales',
    view_all: 'Ver Todos los Productos',
    cta_title: '¿Listo Para Elevar Tu Guardarropa?',
    cta_desc: 'Únete a miles que confían en Dress Me by Oj para moda africana premium.',
    cta_btn: 'Contáctanos',
    testimonial_label: 'Testimonios', testimonial_title: 'Lo Que Dicen Nuestros Clientes',
    test1_text: 'La calidad de la ropa de Dress Me by Oj es excepcional. Cada pieza ha sido motivo de conversación.',
    test1_role: 'Entusiasta de la Moda',
    test2_text: 'Llevo dos años usando Dress Me by Oj. La artesanía es impecable y siempre recibo cumplidos.',
    test2_role: 'Cliente Leal',
    test3_text: 'Desde la calidad de la tela hasta los detalles del cosido, todo habla de lujo.',
    test3_role: 'Influencer de Estilo',
    footer_desc: 'Una marca de ropa en rápido crecimiento en África, especializada en la fabricación de ropa de moda.',
    footer_pages: 'Páginas', footer_company: 'Empresa', footer_contact: 'Contacto',
    chat_status: 'En línea – Listo para ayudar',
    chat_welcome: '¡Hola! 👋 Bienvenido a Dress Me by Oj. ¿Cómo puedo ayudarte hoy?',
    chat_placeholder: 'Escribe tu mensaje...',
    qr_products: 'Productos', qr_order: 'Hacer Pedido', qr_sizes: 'Tallas', qr_contact: 'Contacto',
    qr_products_msg: '¿Qué productos ofrecen?', qr_order_msg: '¿Cómo puedo hacer un pedido?',
    qr_sizes_msg: '¿Qué tallas tienen?', qr_contact_msg: '¿Cómo contactarlos?',
    contact_label: 'Contacto', page_contact_title: 'Contacta <span class="text-gold">Con Nosotros</span>',
    page_contact_subtitle: 'Nos Encantaría Saber de Ti',
    getintouch_label: 'Contacto', getintouch_title: 'Iniciemos una Conversación',
    getintouch_desc: 'Ya sea una pregunta sobre productos, un pedido personalizado, o una oportunidad de mayoreo, estamos aquí para ayudarte.',
    phone_label: 'Teléfono', email_label: 'Correo', location_label: 'Ubicación',
    location_value: 'África', hours_label: 'Horario', hours_value: 'Lun - Sáb: 9:00 AM - 6:00 PM',
    form_name: 'Tu Nombre', form_email: 'Tu Correo', form_subject: 'Asunto',
    form_phone: 'Teléfono', form_message: 'Mensaje', form_submit: 'Enviar Mensaje',
    read_more: 'Leer Más', subscribe_btn: 'Suscribirse',
    newsletter_title: 'Mantente Informado', newsletter_desc: 'Suscríbete para recibir las últimas novedades de moda y ofertas exclusivas.',

    // Products (New)
    prod_white_tank: "Camiseta Blanca 'Dress Me'", prod_white_tank_desc: "Logotipo Script Exclusivo",
    prod_black_long: "Manga Larga Negra 'Dress Me'", prod_black_long_desc: "Logotipo Circular Exclusivo",
    prod_black_tank: "Camiseta Negra 'Dress Me'", prod_black_tank_desc: "Logotipo Script Exclusivo",

    // Page - About
    page_about_title: 'SOBRE NOSOTROS',
    story_label: 'Quiénes Somos', story_title: 'Nacido en África, Hecho para el Mundo',
    story_p1: 'Dress Me by Oj es una marca de ropa de rápido crecimiento en África, especializada en la fabricación de ropa de moda para el público. Fundada con pasión y aprecio por el arte africano.',
    story_p2: 'Nuestros diseños se inspiran en las culturas vibrantes, texturas ricas y colores audaces de África, reimaginados para el consumidor global moderno.',
    story_p3: 'Cada prenda que sale de nuestro taller lleva consigo el espíritu de innovación, el toque de manos expertas y la promesa de calidad sin concesiones.',

    // About - Mission
    mv_label: 'Nuestro Propósito', mv_title: 'Misión y Visión',
    mission_heading: 'Nuestra Misión', mission_text: 'Fabricar ropa de moda de alta calidad que empodere a las personas para expresar su estilo único mientras celebramos la riqueza de la herencia africana.',
    vision_heading: 'Nuestra Visión', vision_text: 'Ver nuestra marca conquistar el mundo — convirtiéndose en la marca de moda africana líder reconocida globalmente.',
    values_heading: 'Nuestros Valores', values_text: 'Calidad, creatividad, integridad y orgullo cultural son las piedras angulares de todo lo que hacemos.',

    // About - Timeline
    journey_label: 'Nuestro Viaje', journey_title: 'Un Legado en Construcción',
    tl1_title: 'El Comienzo', tl1_desc: 'Dress Me by Oj nació de la visión de llevar la moda africana premium al mundo.',
    tl2_title: 'Primera Colección', tl2_desc: 'Nuestra colección debut recibió una respuesta abrumadora, estableciendo nuestro estilo característico.',
    tl3_title: 'Expandiendo Horizontes', tl3_desc: 'Expandimos operaciones, llegando a clientes en más de 15 países.',
    tl4_title: 'Hacia el Mundo', tl4_desc: 'Dress Me by Oj continúa su viaje para convertirse en la marca de moda más reconocida de África.',

    // About - Team
    team_label: 'Detrás de la Marca', team_title: 'Conoce a Nuestro Equipo', team_subtitle: 'Las personas talentosas que dan vida a Dress Me by Oj cada día.',
    team1_name: 'OJ', team1_role: 'Fundador y Director Creativo', team1_desc: 'El visionario detrás de la marca, impulsando la innovación y la dirección creativa.',
    team2_name: 'Equipo de Diseño', team2_role: 'Artesanos Creativos', team2_desc: 'Nuestro talentoso equipo transforma ideas en prendas impresionantes.',
    team3_name: 'Equipo de Producción', team3_role: 'Maestros Artesanos', team3_desc: 'Artesanos expertos que aseguran que cada puntada cumpla con nuestros estándares.',

    // About - CTA
    about_cta_title: 'Únete a Nuestro Viaje', about_cta_desc: 'Sé parte del movimiento que está redefiniendo la moda africana para el mundo.',
  },
  ar: {
    nav_home: 'الرئيسية', nav_about: 'من نحن', nav_products: 'المنتجات',
    nav_gallery: 'المعرض', nav_blog: 'المدونة والأخبار', nav_contact: 'اتصل بنا',
    hero_tagline: 'صُنع في أفريقيا، يُرتدى عالميًا',
    hero_title: 'إعادة تعريف <span class="highlight">الأزياء</span> بالأناقة الأفريقية',
    hero_desc: 'تقدم لك "درِس مي باي أوجي" ملابس فاخرة مصنوعة يدويًا تمزج بين الأناقة المعاصرة والتراث الأفريقي الغني.',
    hero_cta1: 'استكشف المجموعة', hero_cta2: 'قصتنا', scroll: 'انتقل',
    stat_customers: 'عملاء سعداء', stat_designs: 'تصاميم فريدة',
    stat_countries: 'دول', stat_quality: 'جودة حرفية',
    about_label: 'من نحن', about_title: 'قصتنا',
    about_vision: '"رؤيتنا أن نرى علامتنا التجارية تغزو العالم"',
    about_p1: 'درِس مي باي أوجي هي علامة تجارية سريعة النمو في أفريقيا، متخصصة في تصنيع الملابس العصرية لعامة الناس.',
    about_p2: 'كل قطعة ملابس ننتجها هي شهادة على التزامنا بالجودة والأناقة والتراث الثقافي الأفريقي الغني.',
    feat_quality: 'جودة متميزة', feat_quality_desc: 'أجود الأقمشة عالميًا',
    feat_craft: 'حرفية خبيرة', feat_craft_desc: 'حرفيون مهرة في كل غرزة',
    feat_modern: 'تصاميم عصرية', feat_modern_desc: 'أزياء أفريقية معاصرة',
    feat_sustain: 'أزياء مستدامة', feat_sustain_desc: 'تصنيع صديق للبيئة',
    learn_more: 'اعرف المزيد',
    products_label: 'مجموعة مميزة', products_title: 'مختارة لك',
    products_subtitle: 'اكتشف أكثر قطعنا طلبًا، كل منها مصنوع بعناية فائقة.',
    tag_new: 'جديد', tag_trending: 'رائج', tag_exclusive: 'حصري',
    prod_evening: 'أناقة مسائية', prod_evening_desc: 'ملابس سهرة راقية لليالي لا تُنسى',
    prod_casual: 'كاجوال عصري', prod_casual_desc: 'أناقة يومية بلمسة أفريقية',
    prod_heritage: 'خط التراث', prod_heritage_desc: 'تفسيرات عصرية لأنماط أفريقية خالدة',
    view_all: 'عرض جميع المنتجات',
    cta_title: 'هل أنت مستعد لتطوير خزانة ملابسك؟',
    cta_desc: 'انضم إلى آلاف عشاق الموضة الذين يثقون في درس مي باي أوجي.',
    cta_btn: 'تواصل معنا',
    testimonial_label: 'آراء العملاء', testimonial_title: 'ماذا يقول عملاؤنا',
    test1_text: 'جودة ملابس درس مي باي أوجي استثنائية. كل قطعة اشتريتها كانت مثار إعجاب.',
    test1_role: 'عاشق الموضة',
    test2_text: 'أرتدي ملابس درس مي باي أوجي منذ عامين. الحرفية لا مثيل لها.',
    test2_role: 'عميل وفي',
    test3_text: 'من جودة القماش إلى التفاصيل الدقيقة، كل شيء يتحدث عن الفخامة.',
    test3_role: 'مؤثر أزياء',
    footer_desc: 'علامة تجارية سريعة النمو في أفريقيا، متخصصة في تصنيع الملابس العصرية.',
    footer_pages: 'الصفحات', footer_company: 'الشركة', footer_contact: 'التواصل',
    chat_status: 'متصل – جاهز للمساعدة',
    chat_welcome: 'مرحبًا! 👋 أهلاً بك في درس مي باي أوجي. كيف يمكنني مساعدتك اليوم؟',
    chat_placeholder: 'اكتب رسالتك...',
    qr_products: 'المنتجات', qr_order: 'اطلب الآن', qr_sizes: 'المقاسات', qr_contact: 'تواصل',
    qr_products_msg: 'ما هي المنتجات التي تقدمونها؟', qr_order_msg: 'كيف يمكنني تقديم طلب؟',
    qr_sizes_msg: 'ما هي المقاسات المتوفرة؟', qr_contact_msg: 'كيف يمكنني التواصل معكم؟',
    contact_label: 'تواصل معنا', page_contact_title: 'اتصل <span class="text-gold">بنا</span>',
    page_contact_subtitle: 'يسعدنا سماع رأيك',
    getintouch_label: 'تواصل', getintouch_title: 'لنبدأ محادثة',
    getintouch_desc: 'سواء كان لديك سؤال عن منتجاتنا أو تحتاج طلب خاص، نحن هنا لمساعدتك.',
    phone_label: 'الهاتف', email_label: 'البريد الإلكتروني', location_label: 'الموقع',
    location_value: 'أفريقيا', hours_label: 'ساعات العمل', hours_value: 'الاثنين - السبت: 9:00 ص - 6:00 م',
    form_name: 'اسمك', form_email: 'بريدك الإلكتروني', form_subject: 'الموضوع',
    form_phone: 'رقم الهاتف', form_message: 'الرسالة', form_submit: 'إرسال الرسالة',
    read_more: 'اقرأ المزيد', subscribe_btn: 'اشترك',
    newsletter_title: 'ابقَ على اطلاع', newsletter_desc: 'اشترك في نشرتنا لآخر أخبار الموضة والعروض الحصرية.',

    // Products (New)
    prod_white_tank: "تيشيرت أبيض 'دريس مي'", prod_white_tank_desc: "شعار التوقيع النصي",
    prod_black_long: "كم طويل أسود 'دريس مي'", prod_black_long_desc: "شعار الدائرة المميز",
    prod_black_tank: "تيشيرت أسود 'دريس مي'", prod_black_tank_desc: "شعار التوقيع النصي",

    // Page - About
    page_about_title: 'من نحن',
    story_label: 'من نكون', story_title: 'وُلِدنا في أفريقيا، صُنعنا للعالم',
    story_p1: 'دريس مي باي أوجي هي علامة تجارية سريعة النمو في أفريقيا، متخصصة في تصنيع الملابس العصرية. تأسست بشغف للموضة وتقدير عميق للفن الأفريقي.',
    story_p2: 'تصاميمنا مستوحاة من الثقافات النابضة بالحياة والقوام الغني والألوان الجريئة لأفريقيا، أعيد تصورها للمستهلك العالمي الحديث.',
    story_p3: 'كل قطعة ملابس تخرج من ورشتنا تحمل معها روح الابتكار ولمسة الأيدي الماهرة.',

    // About - Mission
    mv_label: 'هدفنا', mv_title: 'المهمة والرؤية',
    mission_heading: 'مهمتنا', mission_text: 'تصنيع ملابس عصرية عالية الجودة تمكن الأفراد من التعبير عن أسلوبهم الفريد مع الاحتفال بثراء التراث الأفريقي.',
    vision_heading: 'رؤيتنا', vision_text: 'أن نرى علامتنا التجارية تغزو العالم — لتصبح العلامة التجارية الرائدة للأزياء الأفريقية المعترف بها عالميًا.',
    values_heading: 'قيمنا', values_text: 'الجودة والإبداع والنزاهة والفخر الثقافي هي حجر الزاوية في كل ما نقوم به.',

    // About - Timeline
    journey_label: 'رحلتنا', journey_title: 'إرث قيد الإنشاء',
    tl1_title: 'البداية', tl1_desc: 'وُلدت دريس مي باي أوجي من رؤية لجلب الأزياء الأفريقية الفاخرة إلى العالم.',
    tl2_title: 'المجموعة الأولى', tl2_desc: 'تلقت مجموعتنا الأولى استجابة ساحقة، مما أرسى أسلوبنا المميز.',
    tl3_title: 'توسيع الآفاق', tl3_desc: 'قمنا بتوسيع العمليات، والوصول إلى العملاء في أكثر من 15 دولة.',
    tl4_title: 'الانطلاق للعالمية', tl4_desc: 'تواصل العلامة التجارية رحلتها لتصبح أكثر العلامات التجارية شهرة في أفريقيا.',

    // About - Team
    team_label: 'وراء العلامة التجارية', team_title: 'قابل فريقنا', team_subtitle: 'الأفراد الموهوبون الذين يحيون دريس مي باي أوجي كل يوم.',
    team1_name: 'أوجي', team1_role: 'المؤسس والمدير الإبداعي', team1_desc: 'صاحب الرؤية وراء العلامة التجارية، يقود الابتكار ويحدد الاتجاه الإبداعي.',
    team2_name: 'فريق التصميم', team2_role: 'حرفيون مبدعون', team2_desc: 'يقوم فريق التصميم الموهوب لدينا بتحويل الأفكار إلى ملابس مذهلة.',
    team3_name: 'فريق الإنتاج', team3_role: 'كبار الحرفيين', team3_desc: 'الحرفيون المهرة الذين يضمنون أن كل غرزة تلبي معايير الجودة الصارمة لدينا.',

    // About - CTA
    about_cta_title: 'انضم لرحلة الموضة', about_cta_desc: 'كن جزءًا من الحركة التي تعيد تعريف الموضة الأفريقية للعالم.',
  }
};

let currentLang = 'en';

function initLanguageSwitcher() {
  // Get saved language
  const saved = localStorage.getItem('dmoj_lang');
  if (saved && translations[saved]) {
    currentLang = saved;
  }

  // Apply saved language
  if (currentLang !== 'en') {
    applyLanguage(currentLang);
  }

  // Update active button
  updateLangButtons();

  // Bind all lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang === currentLang) return;
      currentLang = lang;
      localStorage.setItem('dmoj_lang', lang);
      applyLanguage(lang);
      updateLangButtons();
    });
  });
}

function applyLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;

  // Set direction
  const isRTL = lang === 'ar';
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);

  // Translate elements with data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (dict[key].includes('<')) {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // Translate placeholders (data-i18n-placeholder)
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });

  // --- Auto-translate nav links by href ---
  const navHrefMap = {
    'index.html': 'nav_home',
    'about.html': 'nav_about',
    'products.html': 'nav_products',
    'gallery.html': 'nav_gallery',
    'blog.html': 'nav_blog',
    'contact.html': 'nav_contact'
  };

  document.querySelectorAll('.nav-links a, .mobile-nav a, .footer-col a, .breadcrumb a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('tel:') || href.startsWith('mailto:') || href === '#') return;
    for (const [page, key] of Object.entries(navHrefMap)) {
      if (href.includes(page) && dict[key]) {
        link.textContent = dict[key];
        break;
      }
    }
  });

  // --- Auto-translate footer column headings ---
  const footerCols = document.querySelectorAll('.footer-col');
  const footerHeadingKeys = ['footer_pages', 'footer_company', 'footer_contact'];
  footerCols.forEach((col, i) => {
    const h4 = col.querySelector('h4');
    if (h4 && footerHeadingKeys[i] && dict[footerHeadingKeys[i]]) {
      h4.textContent = dict[footerHeadingKeys[i]];
    }
  });

  // --- Auto-translate footer brand description ---
  const footerBrandP = document.querySelector('.footer-brand p');
  if (footerBrandP && dict['footer_desc']) {
    footerBrandP.textContent = dict['footer_desc'];
  }

  // --- Auto-translate breadcrumb current page text ---
  const breadcrumbSpans = document.querySelectorAll('.breadcrumb span');
  breadcrumbSpans.forEach(span => {
    if (span.textContent === '/' || span.textContent.trim() === '/') return;
    const text = span.textContent.trim();
    // Match breadcrumb text to nav keys
    const breadcrumbMap = {
      'About Us': 'nav_about', 'About': 'nav_about',
      'Products': 'nav_products', 'Gallery': 'nav_gallery',
      'Blog': 'nav_blog', 'Contact': 'nav_contact',
      'Nosotros': 'nav_about', 'Productos': 'nav_products',
      'Galería': 'nav_gallery', 'Contacto': 'nav_contact',
      'من نحن': 'nav_about', 'المنتجات': 'nav_products',
      'المعرض': 'nav_gallery', 'المدونة': 'nav_blog', 'اتصل بنا': 'nav_contact'
    };
    const key = breadcrumbMap[text];
    if (key && dict[key]) {
      span.textContent = dict[key];
    }
  });

  // --- Auto-translate all input placeholders ---
  const placeholderMap = {
    'Type your message...': 'chat_placeholder',
    'Escribe tu mensaje...': 'chat_placeholder',
    'اكتب رسالتك...': 'chat_placeholder'
  };
  document.querySelectorAll('.chat-input').forEach(input => {
    if (dict['chat_placeholder']) {
      input.placeholder = dict['chat_placeholder'];
    }
  });

  // Auto-translate quick reply buttons
  const qrBtns = document.querySelectorAll('.quick-reply-btn');
  const qrKeys = ['qr_products', 'qr_order', 'qr_sizes', 'qr_contact'];
  const qrMsgKeys = ['qr_products_msg', 'qr_order_msg', 'qr_sizes_msg', 'qr_contact_msg'];

  qrBtns.forEach((btn, i) => {
    // Update button text
    if (qrKeys[i] && dict[qrKeys[i]]) {
      btn.textContent = dict[qrKeys[i]];
    }
    // Update data-msg (what is actually sent)
    if (qrMsgKeys[i] && dict[qrMsgKeys[i]]) {
      btn.setAttribute('data-msg', dict[qrMsgKeys[i]]);
    }
  });

  // --- Auto-translate chat header ---
  const chatHeaderP = document.querySelector('.chat-header-info p');
  if (chatHeaderP && dict['chat_status']) {
    chatHeaderP.textContent = dict['chat_status'];
  }
}

function updateLangButtons() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
  });
}

/* ========== FUNCTIONAL ENHANCEMENTS ========== */

/* ---------- Page Loader ---------- */
function initPageLoader() {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = '<div class="loader-spinner"></div>';
  document.body.prepend(loader);
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
    setTimeout(() => loader.remove(), 900);
  });
}

/* ---------- Back to Top ---------- */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '↑';
  btn.title = 'Back to top';
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.pageYOffset > 400);
  });
}

/* ---------- Blog Article Modals ---------- */
const blogArticles = [
  {
    title: 'The Rise of African Fashion on the Global Stage',
    date: 'Feb 10, 2026', category: 'Fashion',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=900&q=80',
    content: `African fashion is experiencing an unprecedented moment on the global stage. From the runways of Paris and Milan to the red carpets of Hollywood, African designers and brands are making their mark in ways never seen before.\n\nAt Dress Me by Oj, we've been part of this exciting movement since our inception. Our designs draw from the rich tapestry of African culture — the vibrant colors of West African textiles, the intricate beadwork of East African traditions, and the bold patterns that tell stories of heritage and identity.\n\nThe global fashion industry is finally recognizing what we've always known: African fashion is not a trend — it's a movement. With sustainable practices at our core and craftsmanship passed down through generations, we're creating pieces that resonate with fashion-forward individuals worldwide.\n\nOur latest collections have been featured in multiple international fashion publications, and we continue to push boundaries while staying true to our roots. The future of fashion is African, and we're proud to be leading the charge.`
  },
  {
    title: 'Introducing Our Spring/Summer 2026 Collection',
    date: 'Jan 28, 2026', category: 'Collection',
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80',
    content: `We're thrilled to unveil our Spring/Summer 2026 collection — a celebration of warmth, vibrancy, and the boundless creativity of African artistry.\n\nThis season, we've drawn inspiration from the landscapes of the African continent: the golden savannas, the deep blues of coastal waters, and the lush greens of tropical forests. Each piece in the collection tells a story of beauty and resilience.\n\nKey highlights include our new lightweight evening wear line, featuring flowing silhouettes crafted from premium organic cotton and silk blends. The casual wear range introduces bold new prints designed exclusively by our in-house artists, blending traditional motifs with contemporary geometric patterns.\n\nOur accessories line has also expanded with handcrafted jewelry pieces, each made by skilled artisans using ethically sourced materials. From statement necklaces to delicate bracelets, every piece is a work of art.\n\nThe collection is available now through our direct ordering channels. Contact us to schedule a personal viewing or to place your order.`
  },
  {
    title: 'The Art of Craftsmanship: Behind Every Stitch',
    date: 'Jan 15, 2026', category: 'Behind the Scenes',
    img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=80',
    content: `At Dress Me by Oj, every garment begins as a vision and ends as a masterpiece. Our craftsmanship process is a journey that combines traditional techniques with modern innovation.\n\nOur workshop is home to over 20 skilled artisans, each bringing years of experience and passion to their craft. From the initial sketch to the final stitch, every step is performed with meticulous attention to detail.\n\nFabric selection is where it all begins. We source the finest materials from across Africa and around the world — Egyptian cotton, Ghanaian kente cloth, South African silk, and Italian wool. Each fabric is carefully inspected for quality before entering our production process.\n\nOur cutting room uses a combination of traditional hand-cutting techniques and precision tools to ensure every pattern piece is perfect. Our seamstresses then bring the design to life, with some pieces requiring over 40 hours of handwork.\n\nQuality control is the final step. Every garment undergoes a thorough inspection before it reaches our customers, ensuring that the Dress Me by Oj name is synonymous with excellence.`
  },
  {
    title: '5 Ways to Style African-Inspired Fashion for Every Occasion',
    date: 'Dec 20, 2025', category: 'Style Guide',
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80',
    content: `African-inspired fashion is incredibly versatile. Here are five ways to incorporate our pieces into your wardrobe for any occasion:\n\n1. Office Elegance: Pair our structured blazer with a subtle African print lining over tailored trousers. The touch of pattern peeks through, adding personality to your professional look.\n\n2. Weekend Brunch: Our casual collection includes relaxed-fit shirts with bold prints perfect for a laid-back weekend outing. Pair with jeans or chinos for effortless style.\n\n3. Evening Affairs: Our evening wear line features stunning gowns and suits with intricate embroidery and gold detailing. Perfect for galas, weddings, and special celebrations.\n\n4. Street Style: Mix our graphic tees and statement accessories with your everyday wardrobe. African-inspired jewelry adds instant flair to any outfit.\n\n5. Cultural Events: Embrace the full expression of African fashion with our traditional line. Complete ensembles that honor heritage while celebrating modern design.\n\nRemember, African fashion is about confidence and self-expression. There are no rules — only opportunities to showcase your unique style.`
  },
  {
    title: 'Fashion with Purpose: Our Commitment to Sustainability',
    date: 'Dec 05, 2025', category: 'Sustainability',
    img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80',
    content: `Sustainability isn't just a buzzword at Dress Me by Oj — it's a core principle that guides everything we do.\n\nOur commitment to eco-conscious fashion begins with our materials. We prioritize organic and naturally dyed fabrics, reducing the environmental impact of our production process. Our partnerships with local weavers and textile producers ensure that traditional, low-impact manufacturing methods are preserved.\n\nWaste reduction is another key focus. Our pattern-making process is designed to minimize fabric waste, and any excess materials are repurposed into accessories or donated to local crafting initiatives.\n\nWe've also implemented a garment recycling program, encouraging customers to return old Dress Me by Oj pieces for responsible recycling or repurposing. This circular approach to fashion helps extend the lifecycle of every garment.\n\nOur packaging is 100% biodegradable, made from recycled materials and printed with soy-based inks. We believe that luxury fashion and environmental responsibility can coexist, and we're committed to proving it with every collection.`
  },
  {
    title: 'Empowering Communities Through Fashion',
    date: 'Nov 18, 2025', category: 'Community',
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80',
    content: `Fashion has the power to transform lives, and at Dress Me by Oj, we're committed to using that power for good.\n\nOur manufacturing operations provide employment to skilled artisans across Africa, offering fair wages, safe working conditions, and opportunities for professional growth. Many of our team members have progressed from apprentices to master craftspeople under our training programs.\n\nWe've partnered with local vocational schools to offer fashion design scholarships, helping the next generation of African designers develop their skills and pursue their dreams. Each year, we sponsor 10 students through complete design and tailoring programs.\n\nOur community outreach extends beyond our workshops. Through our "Dress for Success" initiative, we donate professional clothing to young people entering the workforce, helping them make strong first impressions at interviews and in their new careers.\n\nWe believe that when a community thrives, its creativity flourishes. By investing in people, we're not just building a brand — we're building a legacy of empowerment through fashion.`
  }
];

function initBlogModals() {
  // Create article modal container
  const modal = document.createElement('div');
  modal.className = 'article-modal';
  modal.id = 'articleModal';
  modal.innerHTML = `
    <button class="article-modal-close" id="articleModalClose">✕</button>
    <div class="article-modal-content">
      <img class="article-modal-img" id="articleModalImg" src="" alt="">
      <div class="article-modal-body">
        <div class="blog-card-meta">
          <span class="blog-card-date" id="articleModalDate"></span>
          <span class="blog-card-category" id="articleModalCat"></span>
        </div>
        <h2 id="articleModalTitle"></h2>
        <div id="articleModalContent"></div>
      </div>
    </div>`;
  document.body.appendChild(modal);

  // Close modal
  modal.querySelector('#articleModalClose').addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

  // Attach click to blog read-more links
  document.querySelectorAll('.blog-read-more').forEach((link, i) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (blogArticles[i]) openArticle(blogArticles[i]);
    });
  });

  // Also make blog card images clickable
  document.querySelectorAll('.blog-card').forEach((card, i) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('.blog-read-more')) return;
      if (blogArticles[i]) openArticle(blogArticles[i]);
    });
  });
}

function openArticle(article) {
  const modal = document.getElementById('articleModal');
  document.getElementById('articleModalImg').src = article.img;
  document.getElementById('articleModalTitle').textContent = article.title;
  document.getElementById('articleModalDate').textContent = article.date;
  document.getElementById('articleModalCat').textContent = article.category;
  const contentDiv = document.getElementById('articleModalContent');
  contentDiv.innerHTML = article.content.split('\n\n').map(p => `<p>${p}</p>`).join('');
  modal.classList.add('active');
  modal.scrollTop = 0;
}

/* ---------- Product Detail Modals ---------- */
function initProductModals() {
  const modal = document.createElement('div');
  modal.className = 'product-modal';
  modal.id = 'productModal';
  modal.innerHTML = `
    <button class="product-modal-close" id="productModalClose">✕</button>
    <div class="product-modal-content">
      <img class="product-modal-img" id="productModalImg" src="" alt="">
      <div class="product-modal-body">
        <span class="product-card-tag" id="productModalTag"></span>
        <h2 id="productModalTitle"></h2>
        <p id="productModalDesc"></p>
        <p style="font-size:0.9rem; color:var(--color-light-gray); margin-bottom:1.5rem;" id="productModalDetails"></p>
        <a href="contact.html" class="btn btn-primary">Inquire Now</a>
      </div>
    </div>`;
  document.body.appendChild(modal);

  modal.querySelector('#productModalClose').addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

  // Make product cards clickable
  document.querySelectorAll('.product-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const img = card.querySelector('.product-card-img');
      const title = card.querySelector('.product-card-overlay h3');
      const desc = card.querySelector('.product-card-overlay p');
      const tag = card.querySelector('.product-card-tag');
      if (img) document.getElementById('productModalImg').src = img.src;
      if (title) document.getElementById('productModalTitle').textContent = title.textContent;
      if (desc) document.getElementById('productModalDesc').textContent = desc.textContent;
      if (tag) document.getElementById('productModalTag').textContent = tag.textContent;
      document.getElementById('productModalDetails').textContent =
        'Contact us for pricing, available sizes, and customization options. All items can be tailored to your exact measurements.';
      modal.classList.add('active');
    });
  });

  // Make category cards clickable (linking to contact for inquiry)
  document.querySelectorAll('.category-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const title = card.querySelector('h3');
      const desc = card.querySelector('p');
      const img = card.querySelector('img');
      if (img) document.getElementById('productModalImg').src = img.src;
      if (title) document.getElementById('productModalTitle').textContent = title.textContent;
      if (desc) document.getElementById('productModalDesc').textContent = desc.textContent;
      document.getElementById('productModalTag').textContent = 'Collection';
      document.getElementById('productModalDetails').textContent =
        'Browse our full range in this category. Contact us for availability, pricing, and custom orders.';
      modal.classList.add('active');
    });
  });
}

/* ---------- Enhanced Lightbox with Navigation ---------- */
let galleryImages = [];
let currentGalleryIndex = 0;

// Override the existing initLightbox
const _origInitLightbox = initLightbox;
initLightbox = function () {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  // Add nav arrows and counter
  if (!lightbox.querySelector('.lightbox-prev')) {
    const prev = document.createElement('button');
    prev.className = 'lightbox-nav lightbox-prev';
    prev.innerHTML = '‹';
    prev.addEventListener('click', (e) => { e.stopPropagation(); navigateGallery(-1); });

    const next = document.createElement('button');
    next.className = 'lightbox-nav lightbox-next';
    next.innerHTML = '›';
    next.addEventListener('click', (e) => { e.stopPropagation(); navigateGallery(1); });

    const counter = document.createElement('div');
    counter.className = 'lightbox-counter';
    counter.id = 'lightboxCounter';

    lightbox.appendChild(prev);
    lightbox.appendChild(next);
    lightbox.appendChild(counter);
  }

  // Collect gallery images
  document.querySelectorAll('.gallery-item img').forEach(img => {
    galleryImages.push(img.src);
  });

  // Close on backdrop/close button
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.id === 'lightboxClose') {
      lightbox.classList.remove('active');
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') lightbox.classList.remove('active');
    if (e.key === 'ArrowLeft') navigateGallery(-1);
    if (e.key === 'ArrowRight') navigateGallery(1);
  });
};

// Override openLightbox
window.openLightbox = function (el) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (!lightbox || !lightboxImg) return;

  const img = el.querySelector('img');
  if (img) {
    lightboxImg.src = img.src;
    currentGalleryIndex = galleryImages.indexOf(img.src);
    updateLightboxCounter();
    lightbox.classList.add('active');
  }
};

function navigateGallery(dir) {
  if (!galleryImages.length) return;
  currentGalleryIndex = (currentGalleryIndex + dir + galleryImages.length) % galleryImages.length;
  const lightboxImg = document.getElementById('lightboxImg');
  if (lightboxImg) lightboxImg.src = galleryImages[currentGalleryIndex];
  updateLightboxCounter();
}

function updateLightboxCounter() {
  const counter = document.getElementById('lightboxCounter');
  if (counter && galleryImages.length) {
    counter.textContent = `${currentGalleryIndex + 1} / ${galleryImages.length}`;
  }
}

/* ---------- FAQ Accordion (Enhanced) ---------- */
function initFAQAccordion() {
  document.querySelectorAll('.testimonial-card[onclick]').forEach(card => {
    card.removeAttribute('onclick');
    const answer = card.querySelector('p');
    const icon = card.querySelector('h4 span:last-child');
    if (!answer) return;
    answer.style.display = 'none';
    card.addEventListener('click', () => {
      const isOpen = answer.style.display !== 'none';
      // Close all others
      card.parentElement.querySelectorAll('.testimonial-card').forEach(other => {
        const otherA = other.querySelector('p');
        const otherI = other.querySelector('h4 span:last-child');
        if (otherA) otherA.style.display = 'none';
        if (otherI) otherI.textContent = '+';
      });
      if (!isOpen) {
        answer.style.display = 'block';
        if (icon) icon.textContent = '−';
      }
    });
  });
}

/* ---------- Smooth Scroll ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ---------- Inject Dynamic Elements ---------- */
function injectDynamicElements() {
  // Close modals on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const articleModal = document.getElementById('articleModal');
      const productModal = document.getElementById('productModal');
      if (articleModal) articleModal.classList.remove('active');
      if (productModal) productModal.classList.remove('active');
    }
  });
}

/* ---------- Shopping Cart Logic ---------- */
let cart = [];

function initCart() {
  // Load from local storage
  const savedCart = localStorage.getItem('dmoj_cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      cart = [];
    }
  }
  updateCartIcon();

  // Bind toggle (just in case)
  const toggle = document.querySelector('.cart-toggle');
  if (toggle) toggle.addEventListener('click', toggleCart);
}

function toggleCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer && drawer.classList.contains('open')) {
    closeCart();
  } else {
    openCart();
  }
}

function openCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer) drawer.classList.add('open');
  if (overlay) overlay.classList.add('open');
  renderCartItems();
}

function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

function addToCart(id, title, price, image) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, title, price, image, qty: 1 });
  }

  // Show feedback on button
  const btn = event?.target;
  if (btn && btn.tagName === 'BUTTON') {
    const originalText = btn.textContent;
    const originalBg = btn.style.background;
    const originalColor = btn.style.color;

    btn.textContent = "ADDED ✓";
    btn.style.background = "#000";
    btn.style.color = "#fff";

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = originalBg;
      btn.style.color = originalColor;
    }, 1500);
  }

  saveCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCartItems();
}

function updateQty(id, change) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) removeFromCart(id);
    else {
      saveCart();
      renderCartItems();
    }
  }
}

function saveCart() {
  localStorage.setItem('dmoj_cart', JSON.stringify(cart));
  updateCartIcon();
}

function updateCartIcon() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!container) return;

  container.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = '<p class="text-center" style="margin-top:2rem; color: #888;">Your cart is empty.</p>';
  } else {
    cart.forEach(item => {
      total += item.price * item.qty;
      container.innerHTML += `
        <div class="cart-item">
          <img src="${item.image}" class="cart-item-img" alt="${item.title}">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.title}</h4>
            <div class="cart-item-price">$${item.price}</div>
            <div class="cart-item-actions">
              <div class="item-quantity">
                <button class="qty-btn" onclick="updateQty('${item.id}', -1)">−</button>
                <span class="qty-span">${item.qty}</span>
                <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
              </div>
              <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
          </div>
        </div>
      `;
    });
  }

  if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
}

function checkout() {
  if (cart.length === 0) return;

  // Construct WhatsApp message
  let msg = "Hello! I'd like to place an order:%0A%0A";
  let total = 0;
  cart.forEach(item => {
    msg += `${item.qty}x ${item.title} - $${(item.price * item.qty).toFixed(2)}%0A`;
    total += item.price * item.qty;
  });
  msg += `%0ATotal: $${total.toFixed(2)}%0A%0APlease confirm availability.`;

  window.open(`https://wa.me/27836982296?text=${msg}`, '_blank');
}
