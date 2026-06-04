import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  phone: String,
  company: String,
  service: String,
  message: String,
  status: { type: String, default: 'new' },
  date: String
});

const InvoiceSchema = new mongoose.Schema({
  id: String,
  client: String,
  email: String,
  amount: Number,
  items: String,
  status: { type: String, default: 'draft' },
  date: String,
  dueDate: String
});

const ClientSchema = new mongoose.Schema({
  id: String,
  name: String,
  company: String,
  email: String,
  phone: String,
  stage: { type: String, default: 'prospect' },
  value: Number,
  date: String
});

const PaymentSchema = new mongoose.Schema({
  id: String,
  client: String,
  invoice: String,
  amount: Number,
  method: String,
  status: { type: String, default: 'pending' },
  date: String
});

const TaskSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  assigneeName: String,
  assigneeEmail: String,
  role: String,
  status: { type: String, default: 'todo' }, // todo, in-progress, done
  dueDate: String,
  createdAt: { type: Date, default: Date.now }
});

const AdminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const MeetingSchema = new mongoose.Schema({
  id: String,
  clientName: String,
  clientEmail: String,
  teamEmail: String,
  meetingType: { type: String, default: 'client' }, // client, internal, discovery
  date: String,
  time: String,
  meetingLink: String,
  status: { type: String, default: 'scheduled' }, // scheduled, ongoing, completed, cancelled
  notes: String,
  reminded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const OutreachLeadSchema = new mongoose.Schema({
  id: String,
  name: String,
  company: String,
  email: String,
  phone: String,
  emailStatus: { type: String, default: 'Pending' }, // Pending, Verified, Invalid
  leadScore: { type: Number, default: 0 }, // 0 to 100
  emailSent: { type: Boolean, default: false },
  replyReceived: { type: String, default: 'No Reply' }, // No Reply, Interested, Maybe Later, Not Interested, Out of Office
  meetingBooked: { type: Boolean, default: false },
  status: { type: String, default: 'Sourced' }, // Sourced, Qualified, Emailed, Replied, Booked, Rejected
  followUpCount: { type: Number, default: 0 },
  personalMessage: String,
  source: { type: String, default: 'Apollo' }, // Apollo, LinkedIn, Google Maps, Apify
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

const SocialMetricSchema = new mongoose.Schema({
  platform: { type: String, default: 'aggregated' }, // aggregated, linkedin, instagram, reddit, whatsapp
  visitors: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  interested: { type: Number, default: 0 },
  unfollows: { type: Number, default: 0 },
  reposts: { type: Number, default: 0 },
  dms: { type: Number, default: 0 },
  profileUrl: { type: String, default: '' },
  apiKey: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

const SalesAttributionSchema = new mongoose.Schema({
  platform: String, // LinkedIn, Google Maps, Apollo, Reddit, Instagram, Referral
  clientCount: { type: Number, default: 0 }
});

const ChatbotConversationSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  messages: [{
    sender: String, // 'user' or 'agent'
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  lastUserMessage: String,
  lastAgentMessage: String,
  messageCount: { type: Number, default: 0 },
  whatsappClicked: { type: Boolean, default: false },
  status: { type: String, default: 'active' }, // active, closed, converted
  source: { type: String, default: 'website' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Lead = mongoose.model('Lead', LeadSchema);
export const Invoice = mongoose.model('Invoice', InvoiceSchema);
export const Client = mongoose.model('Client', ClientSchema);
export const Payment = mongoose.model('Payment', PaymentSchema);
export const Task = mongoose.model('Task', TaskSchema);
export const Meeting = mongoose.model('Meeting', MeetingSchema);
export const OutreachLead = mongoose.model('OutreachLead', OutreachLeadSchema);
export const AdminUser = mongoose.model('AdminUser', AdminUserSchema);
export const SocialMetric = mongoose.model('SocialMetric', SocialMetricSchema);
export const SalesAttribution = mongoose.model('SalesAttribution', SalesAttributionSchema);
export const ChatbotConversation = mongoose.model('ChatbotConversation', ChatbotConversationSchema);
