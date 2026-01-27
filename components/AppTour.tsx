import React, { useState, useEffect } from 'react';
import { 
  Info, LayoutDashboard, ShoppingCart, LayoutGrid, ShieldAlert,
  Lightbulb, Workflow, Gem, ShieldCheck, PlayCircle, Star, Cloud, Brain, DollarSign, Sprout, TrendingUp,
  Tag, Biohazard, // Added Tag and Biohazard icons
  Eye, MessageSquare, Code, Zap // Added for new AI features step
} from 'lucide-react';
import { View } from '../types';

interface AppTourProps {
  setCurrentView: (view: View) => void;
}

const TOUR_STEPS = [
  {
    title: "Welcome to SupermarketAI",
    icon: <Lightbulb size={48} className="text-indigo-600" />,
    targetView: View.ABOUT, // Stay on the tour component itself for intro
    component: () => (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-indigo-50 to-blue-50 relative overflow-hidden rounded-xl">
        <img 
          src="https://picsum.photos/id/1015/800/600" 
          alt="Modern Supermarket" 
          className="absolute inset-0 w-full h-full object-cover opacity-10" 
        />
        <div className="relative z-10 flex flex-col items-center">
          <Lightbulb size={64} className="text-indigo-600 mb-6 animate-pulse" />
          <h3 className="text-4xl font-black text-slate-900 mb-4 drop-shadow-sm">Unlocking Retail Intelligence!</h3>
          <p className="text-xl text-slate-700 max-w-3xl leading-relaxed">
            Welcome to SupermarketAI, your ultimate hub for intelligent retail solutions. This tour is crafted to guide you through powerful insights and innovative features, demonstrating how AI can transform every aspect of your supermarket operations.
          </p>
          <p className="text-md text-slate-500 mt-4 max-w-2xl">
            Dive deep into our analytics, understand our methodologies, and discover how data-driven decisions empower your business to thrive in a dynamic market.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "SupermarketAI's Core AI Features",
    icon: <Brain size={48} className="text-purple-600" />,
    targetView: View.ABOUT, // Stay on the tour component itself for intro
    component: () => (
      <div className="h-full relative overflow-hidden p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-100 flex flex-col justify-between">
        <img 
          src="https://picsum.photos/id/488/1200/800" 
          alt="Abstract AI brain" 
          className="absolute inset-0 w-full h-full object-cover opacity-10" 
        />
        <div className="relative z-10 flex flex-col h-full">
          <h4 className="text-3xl font-black text-slate-900 flex items-center gap-4 mb-6 drop-shadow-sm">
            <Brain size={40} className="text-purple-700" /> Our Intelligent Core: Gemini AI Capabilities
          </h4>
          <p className="text-lg text-slate-700 leading-relaxed mb-6 max-w-3xl">
            SupermarketAI is powered by <strong>Google AI Studio's Gemini API</strong>, leveraging <strong>Gemini 3 Flash Preview</strong> for multimodal analysis, natural language processing, and predictive tasks, alongside <strong>Gemini 2.5 Flash Image</strong> for dedicated image generation. Here's how AI transforms your operations:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 flex-1 max-h-[65%] overflow-y-auto pr-4">
            <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100 flex items-start gap-4">
              <Eye size={24} className="text-blue-600 shrink-0 mt-1" />
              <div>
                <h5 className="text-lg font-bold text-slate-800 mb-1">Multimodal Vision & Analysis</h5>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Real-time visual checks (Shelf Monitoring, Theft Detection, Pricing Detection, Spoilage & Damage, Inventory Tracking, Planogram Compliance, Customer Behaviour, Promotional Monitoring) using advanced image and video understanding.
                </p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100 flex items-start gap-4">
              <MessageSquare size={24} className="text-emerald-600 shrink-0 mt-1" />
              <div>
                <h5 className="text-lg font-bold text-slate-800 mb-1">Natural Language Processing (NLP)</h5>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Intelligent Customer Support, generating Business Insights from complex data, and detailed Report Generation.
                </p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100 flex items-start gap-4">
              <TrendingUp size={24} className="text-amber-600 shrink-0 mt-1" />
              <div>
                <h5 className="text-lg font-bold text-slate-800 mb-1">Predictive Analytics</h5>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Accurate Inventory Forecasting, Out-of-Stock (OOS) Prediction, and identifying key market trends before they impact your business.
                </p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100 flex items-start gap-4">
              <Zap size={24} className="text-pink-600 shrink-0 mt-1" />
              <div>
                <h5 className="text-lg font-bold text-slate-800 mb-1">Generative AI</h5>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Automated Marketing Campaign creation, including compelling Ad Copy and visually striking Hero Graphics.
                </p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100 flex items-start gap-4">
              <Code size={24} className="text-indigo-600 shrink-0 mt-1" />
              <div>
                <h5 className="text-lg font-bold text-slate-800 mb-1">Structured Data & Tools</h5>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Provides precise JSON outputs for easy integration and supports Function Calling to interact with external systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Feature Deep-dive: Inventory & Forecast",
    icon: <ShoppingCart size={48} className="text-blue-600" />,
    targetView: View.INVENTORY,
    component: () => (
      <div className="h-full relative overflow-hidden p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-100">
        <img 
          src="https://picsum.photos/id/1047/1200/800" 
          alt="Inventory Forecasting" 
          className="absolute inset-0 w-full h-full object-cover opacity-10" 
        />
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <h4 className="text-2xl font-bold text-blue-800 flex items-center gap-2 mb-4">
              <Gem size={28} /> Optimize Operations: Inventory & Forecast
            </h4>
            <p className="text-lg text-blue-700 leading-relaxed mb-4">
              <strong>What it does:</strong> Our AI Inventory Forecasting module uses <strong>Gemini 3 Flash Preview's predictive modeling</strong> capabilities and advanced algorithms to predict demand for thousands of SKUs, providing intelligent reorder recommendations to ensure optimal stock levels. It proactively identifies fast-moving products and seasonal shifts.
            </p>
            <p className="text-lg text-blue-700 leading-relaxed mb-4">
              <strong>Workflow/Interaction:</strong> On the `Inventory & Forecast` screen, users select a product. The system then instantly analyzes historical sales data, current stock levels, and external factors (like promotions or weather) to generate a precise demand forecast and a suggested reorder quantity. This interaction replaces manual inventory checks and reduces human error.
            </p>
            <p className="text-lg text-blue-700 leading-relaxed">
              <strong>Real Use Case:</strong> Imagine a sudden heatwave. The AI would detect a surge in demand for cold beverages and ice cream, automatically triggering urgent reorder recommendations, allowing store managers to stock up before shelves go empty. Conversely, it prevents over-ordering perishable goods, minimizing spoilage.
            </p>
          </div>
          <p className="text-md font-semibold text-blue-600 mt-6 flex items-center gap-2 p-3 bg-blue-100 rounded-lg">
            <Star size={20} className="text-blue-700" /> <strong>Retail Client Value:</strong>
            <br/> - <strong>Solves Problem:</strong> Eliminates stockouts, reduces overstocking, and minimizes waste from expired products.
            <br/> - <strong>Improves:</strong> Efficiency by automating complex forecasting, customer experience through consistent product availability, and decision-making with data-driven insights.
            <br/> - <strong>Benefits:</strong> Up to 15-20% reduction in lost sales due to stockouts, 10-15% decrease in inventory holding costs, and significant reduction in manual labor for inventory management.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Feature Deep-dive: Shelf Monitoring",
    icon: <LayoutGrid size={48} className="text-emerald-600" />,
    targetView: View.SHELF_MONITORING,
    component: () => (
      <div className="h-full relative overflow-hidden p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-100">
        <img 
          src="https://picsum.photos/id/1050/1200/800" 
          alt="Shelf Monitoring" 
          className="absolute inset-0 w-full h-full object-cover opacity-10" 
        />
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <h4 className="text-2xl font-bold text-emerald-800 flex items-center gap-2 mb-4">
              <Workflow size={28} /> Enhance Compliance: Shelf Monitoring
            </h4>
            <p className="text-lg text-emerald-700 leading-relaxed mb-4">
              <strong>What it does:</strong> Our Shelf Monitoring system uses <strong>Gemini 3 Flash Preview's advanced AI vision</strong> to perform real-time visual checks of stock levels, product placement, and overall shelf integrity. It continuously compares actual shelf conditions against ideal planograms.
            </p>
            <p className="text-lg text-emerald-700 leading-relaxed mb-4">
              <strong>Workflow/Interaction:</strong> Users upload images or video feeds from store cameras or mobile devices to the `Shelf Monitoring` interface. The AI processes these visuals, identifying out-of-stock items, misplaced products, incorrect pricing, and even potential spoilage. Discrepancies are highlighted visually on the image and flagged as actionable alerts. This interaction replaces manual, labor-intensive shelf audits.
            </p>
            <p className="text-lg text-emerald-700 leading-relaxed">
              <strong>Real Use Case:</strong> A store manager can upload a snapshot of the snack aisle. The AI immediately detects several empty spots for a popular chip brand, a misplaced soda can, and a promotional sign that's expired. An alert is generated for each, allowing staff to quickly rectify the issues before they impact sales or customer perception.
            </p>
          </div>
          <p className="text-md font-semibold text-emerald-600 mt-6 flex items-center gap-2 p-3 bg-emerald-100 rounded-lg">
            <Star size={20} className="text-emerald-700" /> <strong>Retail Client Value:</strong>
            <br/> - <strong>Solves Problem:</strong> Ensures products are always available and correctly displayed, preventing lost sales and maintaining brand image.
            <br/> - <strong>Improves:</strong> Operational efficiency through automated audits, customer experience with consistently well-stocked shelves, and compliance with merchandising standards.
            <br/> - <strong>Benefits:</strong> Up to 25% faster identification of shelf issues, 5-10% increase in product visibility, and reduced manual labor for visual checks by 70-80%.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Feature Deep-dive: Theft Detection",
    icon: <ShieldAlert size={48} className="text-rose-600" />,
    targetView: View.THEFT_DETECTION,
    component: () => (
      <div className="h-full relative overflow-hidden p-6 bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg border border-rose-100">
        <img 
          src="https://picsum.photos/id/1049/1200/800" 
          alt="Theft Detection" 
          className="absolute inset-0 w-full h-full object-cover opacity-10" 
        />
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <h4 className="text-2xl font-bold text-rose-800 flex items-center gap-2 mb-4">
              <ShieldCheck size={28} /> Fortify Security: Theft Detection
            </h4>
            <p className="text-lg text-rose-700 leading-relaxed mb-4">
              <strong>What it does:</strong> Our Theft Detection module uses <strong>Gemini 3 Flash Preview's advanced AI vision</strong> to provide real-time surveillance, identifying suspicious activities like shelf sweeping, product concealment, or unusual handling patterns. It's designed to proactively prevent loss and enhance store safety.
            </p>
            <p className="text-lg text-rose-700 leading-relaxed mb-4">
              <strong>Workflow/Interaction:</strong> Integrate with existing CCTV feeds or upload video segments to the `Theft Detection` interface. The AI analyzes human actions and product interactions, automatically flagging anomalous behaviors with a confidence score. Security personnel are immediately alerted with contextual information and video snippets, enabling rapid intervention.
            </p>
            <p className="text-lg text-rose-700 leading-relaxed">
              <strong>Real Use Case:</strong> During a busy period, the AI observes a customer rapidly clearing a section of expensive razor blades into a bag. It instantly triggers a 'Shelf Sweeping' alert with a high confidence score, sending a notification to the security guard's tablet, who can then discreetly monitor or approach the individual. This prevents potential significant losses before they occur.
            </p>
          </div>
          <p className="text-md font-semibold text-rose-600 mt-6 flex items-center gap-2 p-3 bg-rose-100 rounded-lg">
            <Star size={20} className="text-rose-700" /> <strong>Retail Client Value:</strong>
            <br/> - <strong>Solves Problem:</strong> Directly addresses inventory shrinkage and theft, which are major financial drains for retailers.
            <br/> - <strong>Improves:</strong> Store security and safety for both customers and staff, loss prevention efforts with proactive intelligence, and decision-making for security teams.
            <br/> - <strong>Benefits:</strong> Potential reduction in shrinkage rates by 20-30%, faster incident response times, and an overall deterrent effect on illicit activities.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Feature Deep-dive: Pricing Detection",
    icon: <Tag size={48} className="text-purple-600" />,
    targetView: View.PRICING_DETECTION,
    component: () => (
      <div className="h-full relative overflow-hidden p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-100">
        <img 
          src="https://picsum.photos/id/1084/1200/800" 
          alt="Pricing Detection" 
          className="absolute inset-0 w-full h-full object-cover opacity-10" 
        />
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <h4 className="text-2xl font-bold text-purple-800 flex items-center gap-2 mb-4">
              <Tag size={28} /> Ensure Accuracy: Pricing Detection
            </h4>
            <p className="text-lg text-purple-700 leading-relaxed mb-4">
              <strong>What it does:</strong> Our Pricing Detection module uses <strong>Gemini 3 Flash Preview's advanced AI vision and Optical Character Recognition (OCR)</strong> to perform real-time audits of shelf prices, promotional tags, and product labels. It ensures that displayed prices are accurate and compliant with the system.
            </p>
            <p className="text-lg text-purple-700 leading-relaxed mb-4">
              <strong>Workflow/Interaction:</strong> Store staff upload images or video feeds of product aisles to the `Pricing Detection` interface. The AI scans each visible price tag, cross-referencing it with the central product database. Discrepancies, missing tags, or expired promotions are immediately flagged as alerts with visual highlights on the uploaded media. This automates a typically manual and error-prone process.
            </p>
            <p className="text-lg text-purple-700 leading-relaxed">
              <strong>Real Use Case:</strong> A new weekly flyer starts, but a few aisle end-caps still display last week's promotional price. The AI, upon receiving a quick scan of the aisle, identifies these outdated tags. An alert is sent to the floor staff, allowing them to correct the pricing before customers encounter the discrepancy, preventing pricing errors at checkout and potential customer dissatisfaction.
            </p>
          </div>
          <p className="text-md font-semibold text-purple-600 mt-6 flex items-center gap-2 p-3 bg-purple-100 rounded-lg">
            <Star size={20} className="text-purple-700" /> <strong>Retail Client Value:</strong>
            <br/> - <strong>Solves Problem:</strong> Eliminates costly pricing errors, ensures compliance with promotional offers, and reduces legal risks associated with incorrect pricing.
            <br/> - <strong>Improves:</strong> Customer trust and satisfaction by guaranteeing accurate prices, operational efficiency by automating audits, and revenue integrity by preventing undercharging.
            <br/> - <strong>Benefits:</strong> Up to 95% reduction in pricing discrepancies, significant decrease in manual audit time, and enhanced brand reputation for transparency.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Feature Deep-dive: Spoilage Detection",
    icon: <Biohazard size={48} className="text-lime-600" />,
    targetView: View.SPOILAGE_DETECTION,
    component: () => (
      <div className="h-full relative overflow-hidden p-6 bg-gradient-to-br from-lime-50 to-lime-100 rounded-lg border border-lime-100">
        <img 
          src="https://picsum.photos/id/1080/1200/800" 
          alt="Spoilage Detection" 
          className="absolute inset-0 w-full h-full object-cover opacity-10" 
        />
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <h4 className="text-2xl font-bold text-lime-800 flex items-center gap-2 mb-4">
              <Biohazard size={28} /> Uphold Quality: Spoilage Detection
            </h4>
            <p className="text-lg text-lime-700 leading-relaxed mb-4">
              <strong>What it does:</strong> Our Spoilage Detection module uses <strong>Gemini 3 Flash Preview's advanced AI vision</strong> to continuously monitor fresh produce, dairy, and packaged goods for signs of spoilage, damage, or contamination, including spills. It ensures product freshness and safety standards are met.
            </p>
            <p className="text-lg text-lime-700 leading-relaxed mb-4">
              <strong>Workflow/Interaction:</strong> Integrate existing camera feeds or allow staff to upload images/videos of critical sections (e.g., produce, deli, dairy). The AI analyzes visual cues such as discoloration, mold, damaged packaging, or liquid spills. When issues are detected, immediate alerts are generated for staff, indicating the location and severity, prompting rapid intervention. This proactive system replaces subjective and often delayed manual checks.
            </p>
            <p className="text-lg text-lime-700 leading-relaxed">
              <strong>Real Use Case:</strong> In the bustling produce section, a banana bunch starts to show early signs of over-ripeness, or a subtle leak appears from a juice carton in the dairy aisle. The AI detects these changes instantly, sending a 'High Severity' alert to the nearest staff member's mobile device. They can then swiftly remove the product and clean the spill, preventing further spoilage, potential slip hazards, and maintaining product appeal.
            </p>
          </div>
          <p className="text-md font-semibold text-lime-600 mt-6 flex items-center gap-2 p-3 bg-lime-100 rounded-lg">
            <Star size={20} className="text-lime-700" /> <strong>Retail Client Value:</strong>
            <br/> - <strong>Solves Problem:</strong> Significantly reduces food waste due to spoilage, enhances food safety protocols, and mitigates health and safety risks from spills.
            <br/> - <strong>Improves:</strong> Customer confidence in product freshness, operational efficiency through automated quality checks, and compliance with health regulations.
            <br/> - <strong>Benefits:</strong> Potential 10-20% reduction in perishable waste, decreased customer complaints about product quality, and a safer shopping environment for all.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Google AI & Cloud Stack",
    icon: <Cloud size={48} className="text-indigo-600" />,
    targetView: View.ABOUT, // Stay on the tour component itself for tech explanation
    component: () => (
      <div className="h-full relative overflow-hidden p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-100 flex flex-col items-center text-center">
        <img 
          src="https://picsum.photos/id/479/1200/800" 
          alt="Google AI & Cloud Stack" 
          className="absolute inset-0 w-full h-full object-cover opacity-10" 
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-6">
            <Brain size={40} className="text-indigo-600" />
            <h4 className="text-3xl font-black text-slate-800">Our Core Technologies: Google AI & Cloud</h4>
          </div>
          <p className="text-lg text-slate-700 leading-relaxed mb-6 max-w-3xl">
            SupermarketAI is built on a powerful, scalable, and secure foundation of Google Cloud and Google AI Studio technologies. This robust stack ensures high performance, reliability, and continuous innovation.
          </p>
          <div className="space-y-6 max-w-3xl w-full">
            {/* Gemini API */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h5 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-3 mb-3">
                <img src="https://img.icons8.com/color/48/gemini.png" alt="Gemini API" className="h-7 w-7" /> Gemini API (Google AI Studio)
              </h5>
              <p className="text-md text-slate-700 leading-relaxed">
                <strong>Why chosen:</strong> The <strong>Gemini API, including Gemini 3 Flash Preview</strong>, is unparalleled for its multimodal capabilities. It can seamlessly process and understand complex information across text, images, and video, making it ideal for the diverse data types found in retail environments (e.g., visual shelf audits, text-based customer support, predictive analytics). Its flexibility allows us to build intelligent features that truly understand context and provide granular insights.
              </p>
            </div>
            {/* Google Cloud Platform */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h5 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-3 mb-3">
                <img src="https://img.icons8.com/color/48/google-cloud.png" alt="Google Cloud Platform" className="h-7 w-7" /> Google Cloud Platform (GCP)
              </h5>
              <p className="text-md text-slate-700 leading-relaxed">
                <strong>Why chosen:</strong> GCP provides the robust, secure, and infinitely scalable infrastructure required for a demanding retail AI application. It allows us to process vast amounts of real-time visual and sales data, deploy AI models globally with low latency, and ensure maximum uptime and stringent data privacy compliance, forming the reliable backbone for all Gemini-powered operations.
              </p>
            </div>
          </div>
          <p className="text-lg text-slate-700 leading-relaxed mt-8 max-w-3xl">
            Together, these Google technologies form the intelligent backbone of SupermarketAI, delivering unparalleled analytical power and automation to optimize every facet of your retail business.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Feature Summary & Dashboard Access", // Updated title
    icon: <LayoutDashboard size={48} className="text-indigo-600" />,
    targetView: View.DASHBOARD, // Final step, navigate to Dashboard
    component: () => (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden rounded-xl">
        <img 
          src="https://picsum.photos/id/1069/800/600" 
          alt="Business Intelligence Dashboard" 
          className="absolute inset-0 w-full h-full object-cover opacity-10" 
        />
        <div className="relative z-10 flex flex-col items-center">
          <LayoutDashboard size={64} className="text-indigo-600 mb-6" />
          <h3 className="text-4xl font-black text-slate-900 mb-4 drop-shadow-sm">Your SupermarketAI Journey: Features & Next Steps!</h3> {/* Updated heading */}
          <p className="text-xl text-slate-700 max-w-3xl leading-relaxed">
            You've explored the core features and powerful Google AI technologies behind SupermarketAI. Now, step into your personalized Business Intelligence Dashboard, your central hub for real-time performance analytics and actionable insights.
          </p>
          <p className="text-md text-slate-500 mt-4 max-w-2xl">
            Start making data-driven decisions today to optimize operations, enhance security, and elevate customer satisfaction across your supermarket empire.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <DollarSign size={32} className="text-emerald-500" />
            <Sprout size={32} className="text-yellow-500" />
            <TrendingUp size={32} className="text-blue-500" />
          </div>
        </div>
      </div>
    )
  }
];

const AppTour: React.FC<AppTourProps> = ({ setCurrentView }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = TOUR_STEPS[currentStepIndex];

  useEffect(() => {
    // Navigate to the target view of the current step
    setCurrentView(currentStep.targetView);
  }, [currentStep, setCurrentView]);

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // End of tour, navigate to Dashboard
      setCurrentView(View.DASHBOARD);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      // If on first step and user tries to go back from first step, go to Dashboard
      setCurrentView(View.DASHBOARD);
    }
  };

  // Determine the displayed step count
  const displayStep = currentStepIndex < 2 ? 1 : 2;
  const totalDisplaySteps = 2; // Always show 'of 2'

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tour Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center bg-slate-50/50 p-6">
        <div className="max-w-4xl w-full h-full p-8 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center">
          {currentStep.component()}
        </div>
      </div>

      {/* Tour Controls */}
      <div className="p-6 border-t border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <div className="text-sm font-medium text-slate-500">
            Step {displayStep} of {totalDisplaySteps}
          </div>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md"
          >
            {currentStepIndex === TOUR_STEPS.length - 1 ? "Finish Tour" : "Next Feature"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppTour;