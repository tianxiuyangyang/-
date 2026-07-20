import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import {
  ArrowRight,
  Award,
  CalendarDays,
  Check,
  Clapperboard,
  Clock3,
  Globe2,
  Images,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  QrCode,
  Star,
  Send,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import './App.css'

const ink = '#2B221A'
const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
const heroVideo =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4'
const cardVideo =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4'

type Segment = {
  text: string
  className?: string
}

type Message = {
  id: string
  name: string
  content: string
  created_at: string
}

const demoMessages: Message[] = [
  {
    id: 'demo-1',
    name: '访客',
    content: '这个网站明亮了很多，像一本可以翻开的个人作品册。',
    created_at: new Date('2026-07-15T11:00:00+08:00').toISOString(),
  },
  {
    id: 'demo-2',
    name: '创作伙伴',
    content: '暖白背景、深色文字和细腻动效搭在一起，很清爽。',
    created_at: new Date('2026-07-16T15:30:00+08:00').toISOString(),
  },
]

function WordsPullUp({
  text,
  className = '',
  showAsterisk = false,
}: {
  text: string
  className?: string
  showAsterisk?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const words = text.split(' ')

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={{ color: ink }}>
      {words.map((word, index) => {
        const isFinal = index === words.length - 1
        return (
          <span key={`${word}-${index}`} className="overflow-hidden pb-[0.08em]">
            <motion.span
              className="motion-crisp relative inline-block"
              initial={{ y: 24 }}
              animate={isInView ? { y: 0 } : { y: 24 }}
              transition={{ duration: 0.9, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
              {showAsterisk && isFinal ? (
                <sup className="absolute -right-[0.3em] top-[0.65em] text-[0.31em] leading-none">*</sup>
              ) : null}
            </motion.span>
            {index < words.length - 1 ? <span>&nbsp;</span> : null}
          </span>
        )
      })}
    </div>
  )
}

function WordsPullUpMultiStyle({
  segments,
  className = '',
}: {
  segments: Segment[]
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const words = segments.flatMap((segment, segmentIndex) =>
    segment.text.split(' ').map((word, wordIndex) => ({
      id: `${segmentIndex}-${wordIndex}-${word}`,
      word,
      className: segment.className ?? '',
    })),
  )

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`}>
      {words.map((item, index) => (
        <span key={item.id} className="overflow-hidden pb-[0.08em]">
          <motion.span
            className={`motion-crisp inline-block ${item.className}`}
            initial={{ y: 24 }}
            animate={isInView ? { y: 0 } : { y: 24 }}
            transition={{ duration: 0.85, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {item.word}
          </motion.span>
          {index < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </div>
  )
}

function AnimatedParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })

  return (
    <p ref={ref} className="mx-auto mt-10 max-w-2xl text-xs leading-relaxed text-[#5F5144] sm:text-sm md:text-base">
      {text.split('').map((letter, index) => (
        <AnimatedLetter
          key={`${letter}-${index}`}
          index={index}
          totalChars={text.length}
          letter={letter}
          progress={scrollYProgress}
        />
      ))}
    </p>
  )
}

function AnimatedLetter({
  letter,
  index,
  totalChars,
  progress,
}: {
  letter: string
  index: number
  totalChars: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const charProgress = index / totalChars
  const opacity = useTransform(progress, [charProgress - 0.1, charProgress + 0.05], [0.24, 1])
  return <motion.span style={{ opacity }}>{letter}</motion.span>
}

function Hero() {
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const navItems = [
    { label: '我的故事', href: '#our-story' },
    { label: '个人信息', href: '#collective' },
    { label: '创作能力', href: '#workshops' },
    { label: '项目方向', href: '#programs' },
    { label: '留言联系', href: '#inquiries' },
  ]

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return undefined

    const playHeroVideo = () => {
      video.muted = true
      video.playsInline = true
      video.setAttribute('fetchpriority', 'high')
      void video.play().catch(() => {})
    }

    playHeroVideo()
    window.addEventListener('touchstart', playHeroVideo, { once: true, passive: true })
    document.addEventListener('visibilitychange', playHeroVideo)

    return () => {
      window.removeEventListener('touchstart', playHeroVideo)
      document.removeEventListener('visibilitychange', playHeroVideo)
    }
  }, [])

  return (
    <section className="h-screen bg-[#F8F1E6] p-4 md:p-6">
      <div className="relative h-full overflow-hidden rounded-2xl border border-[#E8DCCB] bg-[#FDF8EE] shadow-[0_30px_90px_rgba(112,88,58,0.18)] md:rounded-[2rem]">
        <video
          ref={heroVideoRef}
          className="hero-video absolute inset-0 h-full w-full object-cover"
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-[#F8F1E6]/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#F8F1E6]/25 to-transparent" />

        <nav className="absolute left-1/2 top-0 z-20 -translate-x-1/2 rounded-b-2xl border-x border-b border-[#E6D8C6] bg-[#FFF9ED]/90 px-4 py-2 shadow-[0_14px_35px_rgba(92,70,43,0.12)] backdrop-blur-md md:rounded-b-3xl md:px-8">
          <div className="flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="whitespace-nowrap text-[10px] text-[#5B4939] transition-colors hover:text-[#20170F] sm:text-xs md:text-sm"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="grid items-end gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <WordsPullUp
                text="睿 琛"
                showAsterisk
                className="text-[26vw] font-medium leading-[0.85] tracking-[-0.07em] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]"
              />
            </div>
            <div className="flex max-w-xl flex-col items-start gap-5 pb-3 lg:col-span-4 lg:pb-8">
              <motion.p
                className="text-xs leading-[1.35] text-[#4C3D31] sm:text-sm md:text-base"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                这里是张睿琛的个人主页：用明亮、温暖、清爽的视觉语言，展示经历、作品、想法和每一次值得记录的成长。
              </motion.p>
              <motion.a
                href="#inquiries"
                className="group flex items-center gap-2 rounded-full bg-[#2B221A] py-1 pl-5 pr-1 text-sm font-medium text-[#FFF7E8] transition-all hover:gap-3 sm:text-base"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                给我留言
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF7E8] transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                  <ArrowRight className="h-4 w-4 text-[#2B221A]" />
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function About({ onOpenSecret }: { onOpenSecret: () => void }) {
  const [isSupportOpen, setIsSupportOpen] = useState(false)

  return (
    <section id="our-story" className="bg-[#F8F1E6] px-4 py-20 sm:px-6 md:py-28">
      <div className="relative mx-auto max-w-6xl rounded-[1.75rem] border border-[#E6D8C6] bg-[#FFF9EF] px-6 py-16 text-center shadow-[0_24px_80px_rgba(112,88,58,0.12)] sm:px-10 md:py-24">
        <div className="absolute right-4 top-4 z-10 flex flex-col items-end gap-2 sm:right-6 sm:top-6">
          <button
            type="button"
            onClick={() => setIsSupportOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#DECDB6] bg-[#2B221A] px-4 py-2 text-xs font-bold text-[#FFF7E8] shadow-[0_14px_35px_rgba(92,70,43,0.16)] transition hover:-translate-y-0.5 hover:bg-[#443326] sm:text-sm"
            aria-haspopup="dialog"
          >
            <Sparkles className="h-4 w-4" />
            鼓励支持创作者
          </button>
          <button
            type="button"
            onClick={onOpenSecret}
            className="plant-button relative mt-3 inline-flex items-center gap-2 rounded-full border border-[#BFD4A9] bg-[#FFF7EA] px-4 py-2 text-xs font-bold text-[#2B221A] shadow-[0_14px_35px_rgba(92,70,43,0.12)] transition hover:-translate-y-0.5 hover:bg-white sm:text-sm"
          >
            <Leaf className="h-4 w-4 text-[#6F9B5C]" />
            秘境空间
          </button>
        </div>
        <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-[#9A6B3F] sm:text-xs">视觉创作</p>
        <WordsPullUpMultiStyle
          className="mx-auto max-w-3xl text-3xl leading-[0.95] text-[#2B221A] sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl"
          segments={[
            { text: '我是张睿琛，', className: 'font-normal' },
            { text: '一个持续自学的创作者。', className: 'font-serif italic text-[#8C633F]' },
            { text: '我关注影像表达、视觉设计、前端作品和叙事体验。', className: 'font-normal' },
          ]}
        />
        <AnimatedParagraph text="我希望这个网站不只是简历，而是一个可以持续生长的个人空间：展示经历、整理作品、记录想法，也让每一个来访的人都能留下自己的声音。未来这里会放入更多项目、文章、照片和阶段性的学习成果。" />
      </div>
      {isSupportOpen ? <SupportPaymentDialog onClose={() => setIsSupportOpen(false)} /> : null}
    </section>
  )
}

function SupportPaymentDialog({ onClose }: { onClose: () => void }) {
  const [isQrReady, setIsQrReady] = useState(false)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B221A]/35 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-title"
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-md rounded-[1.75rem] border border-[#E3D2BA] bg-[#FFF9EF] p-6 text-center shadow-[0_35px_100px_rgba(43,34,26,0.28)] sm:p-8"
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#E0CFB8] bg-white/70 text-[#5F5144] transition hover:bg-[#F4E9D8]"
          aria-label="关闭支付界面"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#2B221A] text-[#FFF7E8]">
          <QrCode className="h-6 w-6" />
        </div>
        <p className="mb-3 text-xs uppercase tracking-[0.26em] text-[#9A6B3F]">支持创作者</p>
        <h2 id="support-title" className="text-3xl font-bold leading-tight text-[#2B221A] sm:text-4xl">
          感谢您的支持
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-[#5F5144]">
          每次支持金额为 <span className="font-bold text-[#2B221A]">6 元</span>，请使用微信扫描下方收款码。
        </p>
        <div className="relative mx-auto mt-6 flex aspect-square w-full max-w-[260px] items-center justify-center overflow-hidden rounded-2xl border border-[#E0CFB8] bg-white p-3">
          <img
            className="h-full w-full object-contain"
            src={assetPath('/wechat-pay-qr.jpg')}
            alt="微信收款码，固定支持金额 6 元"
            loading="lazy"
            decoding="async"
            onLoad={() => setIsQrReady(true)}
            onError={(event) => {
              setIsQrReady(false)
              event.currentTarget.style.display = 'none'
            }}
          />
          {!isQrReady ? (
            <div className="absolute max-w-[210px] rounded-2xl border border-dashed border-[#D4BFA5] bg-[#FFF7EA] p-4 text-sm leading-relaxed text-[#5F5144]">
              请将你的微信收款码图片命名为 <span className="font-bold text-[#2B221A]">wechat-pay-qr.jpg</span> 并放入 public 文件夹。
            </div>
          ) : null}
        </div>
        <p className="mt-5 text-xs leading-relaxed text-[#8F7E69]">
          如果需要自动拉起微信支付并校验订单，需要申请微信支付商户号和后端接口；当前静态网站版本使用收款码方式。
        </p>
      </motion.div>
    </div>
  )
}

function PersonalInfo({ onOpenDetails }: { onOpenDetails: () => void }) {
  const details = [
    { icon: UserRound, label: '姓名', value: '张睿琛' },
    { icon: MapPin, label: '位置', value: '中国 / 支持远程协作' },
    { icon: Clapperboard, label: '方向', value: '趣味网站、视觉设计、影像表达、游戏开发、创意项目' },
    { icon: Mail, label: '联系', value: '请在下方留言板联系我' },
  ]

  return (
    <section id="collective" className="bg-[#F8F1E6] px-4 py-10 sm:px-6 md:py-16">
      <div className="mx-auto mb-5 flex max-w-6xl items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#9B8A78]">Personal profile</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-[#2B221A]">个人信息</h2>
        </div>
        <button
          type="button"
          onClick={onOpenDetails}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#2B221A] py-1 pl-5 pr-1 text-sm font-bold text-[#FFF7E8] transition hover:gap-3"
        >
          详细信息
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF7E8]">
            <ArrowRight className="h-4 w-4 text-[#2B221A]" />
          </span>
        </button>
      </div>
      <div className="mx-auto grid max-w-6xl gap-3 md:grid-cols-4">
        {details.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.article
              key={item.label}
              className="rounded-2xl border border-[#E7DAC7] bg-[#FFF7EA] p-5 shadow-[0_14px_45px_rgba(112,88,58,0.08)]"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Icon className="mb-5 h-5 w-5 text-[#8C633F]" />
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#9B8A78]">{item.label}</p>
              <p className="text-sm leading-snug text-[#3D3027]">{item.value}</p>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

function FeatureCard({
  title,
  number,
  icon,
  items,
  index,
}: {
  title: string
  number: string
  icon: string
  items: string[]
  index: number
}) {
  return (
    <motion.article
      className="flex min-h-[360px] flex-col justify-between rounded-2xl border border-[#E2D1BA] bg-[#F4E9D8] p-5 shadow-[0_18px_55px_rgba(112,88,58,0.10)] sm:p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.75, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <img className="mb-10 h-10 w-10 rounded-xl object-cover shadow-sm sm:h-12 sm:w-12" src={icon} alt="" loading="lazy" decoding="async" />
        <div className="mb-7 flex items-start justify-between gap-4">
          <h3 className="text-2xl leading-none text-[#2B221A] sm:text-3xl">{title}</h3>
          <span className="text-xs text-[#9B8A78]">{number}</span>
        </div>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-tight text-[#5F5144]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#8C633F]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <a href="#inquiries" className="mt-10 inline-flex items-center gap-2 text-sm text-[#8C633F]">
        了解更多
        <ArrowRight className="h-4 w-4 -rotate-45" />
      </a>
    </motion.article>
  )
}

function Features({ onOpenWorks }: { onOpenWorks: () => void }) {
  const cards = [
    {
      title: '项目叙事板。',
      number: '01',
      icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
      items: ['梳理每个作品的核心想法', '记录灵感来源与视觉参考', '沉淀可复用的创作流程', '持续归档阶段性成果'],
    },
    {
      title: '灵感复盘。',
      number: '02',
      icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
      items: ['用文字复盘项目得失', '保留创作过程中的关键笔记', '整理工具、资料与学习路径'],
    },
    {
      title: '沉浸空间。',
      number: '03',
      icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
      items: ['用安静的界面承载内容', '让访问体验更像一段短片', '为后续作品展示预留空间'],
    },
  ]

  return (
    <section id="workshops" className="relative min-h-screen overflow-hidden bg-[#F8F1E6] px-4 py-20 sm:px-6 md:py-28">
      <span id="programs" className="absolute top-0" aria-hidden="true" />
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-multiply" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <WordsPullUpMultiStyle
            className="text-xl font-normal leading-tight sm:text-2xl md:text-3xl lg:text-4xl"
            segments={[
              { text: '为个人表达建立清晰而高级的展示方式。', className: 'text-[#2B221A]' },
              { text: '从灵感出发，用细节形成记忆。', className: 'text-[#9B8A78]' },
            ]}
          />
        </div>
        <div className="grid gap-3 sm:gap-2 md:grid-cols-2 md:gap-2 lg:h-[480px] lg:grid-cols-4">
          <motion.button
            type="button"
            onClick={onOpenWorks}
            className="group relative min-h-[360px] overflow-hidden rounded-2xl border border-[#E2D1BA] text-left shadow-[0_18px_55px_rgba(112,88,58,0.10)] outline-none transition hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#8C633F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F1E6] lg:min-h-0"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <video className="absolute inset-0 h-full w-full object-cover opacity-80" src={cardVideo} autoPlay loop muted playsInline preload="metadata" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2B221A]/65 via-[#F8F1E6]/5 to-transparent" />
            <span className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#FFF7E8]/90 px-3 py-2 text-xs font-bold text-[#2B221A] shadow-sm backdrop-blur-sm transition group-hover:gap-3">
              <Images className="h-4 w-4" />
              进入作品页
            </span>
            <p className="absolute bottom-6 left-6 right-6 text-2xl leading-none text-[#FFF7E8] sm:text-3xl">
              这里收藏我的创作现场。
            </p>
          </motion.button>
          {cards.map((card, index) => (
            <FeatureCard key={card.title} {...card} index={index + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function getSupabaseConfig() {
  return {
    url: import.meta.env.VITE_SUPABASE_URL as string | undefined,
    key: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
  }
}

function useMessages() {
  const [messages, setMessages] = useState<Message[]>(demoMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('演示模式：连接 Supabase 后，留言就能被所有访客共同看到。')
  const config = useMemo(getSupabaseConfig, [])
  const hasSupabase = Boolean(config.url && config.key)

  useEffect(() => {
    if (!hasSupabase || !config.url || !config.key) {
      const saved = window.localStorage.getItem('prisma-messages')
      if (saved) {
        setMessages(JSON.parse(saved) as Message[])
      }
      return
    }

    const supabaseUrl = config.url
    const supabaseKey = config.key

    const loadMessages = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/messages?select=*&order=created_at.desc&limit=50`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        })
        if (!response.ok) {
          throw new Error('无法加载留言')
        }
        const data = (await response.json()) as Message[]
        setMessages(data)
        setStatus('公开留言板已连接。')
      } catch {
        setStatus('暂时无法连接 Supabase，当前显示本地演示留言。')
      } finally {
        setIsLoading(false)
      }
    }

    void loadMessages()
  }, [config.key, config.url, hasSupabase])

  const addMessage = async (name: string, content: string) => {
    const nextMessage: Message = {
      id: crypto.randomUUID(),
      name,
      content,
      created_at: new Date().toISOString(),
    }

    if (!hasSupabase || !config.url || !config.key) {
      const nextMessages = [nextMessage, ...messages]
      setMessages(nextMessages)
      window.localStorage.setItem('prisma-messages', JSON.stringify(nextMessages))
      setStatus('已保存到本机。部署前添加 Supabase 配置后，留言会变成公开共享。')
      return
    }

    const supabaseUrl = config.url
    const supabaseKey = config.key

    const response = await fetch(`${supabaseUrl}/rest/v1/messages`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ name, content }),
    })

    if (!response.ok) {
      throw new Error('留言发送失败')
    }

    const [savedMessage] = (await response.json()) as Message[]
    setMessages([savedMessage, ...messages])
    setStatus('留言已发布，所有访客都可以看到。')
  }

  return { messages, addMessage, isLoading, status }
}

function MessageBoard() {
  const { messages, addMessage, isLoading, status } = useMessages()
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState('')

  const submitMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const trimmedName = name.trim()
    const trimmedContent = content.trim()
    if (!trimmedName || !trimmedContent) {
      setError('请填写你的名字和留言内容。')
      return
    }

    setIsPosting(true)
    try {
      await addMessage(trimmedName.slice(0, 40), trimmedContent.slice(0, 280))
      setName('')
      setContent('')
    } catch {
      setError('留言暂时发送失败，请稍后再试。')
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <section id="inquiries" className="bg-[#F8F1E6] px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[1.75rem] border border-[#E6D8C6] bg-[#FFF9EF] p-6 shadow-[0_24px_80px_rgba(112,88,58,0.12)] sm:p-8 md:p-10">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#2B221A] text-[#FFF7E8]">
            <MessageCircle className="h-5 w-5" />
          </div>
          <p className="mb-4 text-xs uppercase tracking-[0.28em] text-[#9B8A78]">公开留言板</p>
          <h2 className="text-4xl leading-[0.95] text-[#2B221A] sm:text-5xl md:text-6xl">
            在这里留下你的想法。
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-[#5F5144] sm:text-base">
            每个人都可以在这里留言。部署前连接 Supabase 后，这个留言板就会成为真正公开共享的访客墙。
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs text-[#8C633F]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DECDB6] bg-[#FFF6E8] px-3 py-2">
              <Globe2 className="h-3.5 w-3.5" /> 公开可见
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DECDB6] bg-[#FFF6E8] px-3 py-2">
              <Clock3 className="h-3.5 w-3.5" /> 可上线
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DECDB6] bg-[#FFF6E8] px-3 py-2">
              <Sparkles className="h-3.5 w-3.5" /> 易维护
            </span>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[#E6D8C6] bg-[#FFF7EA] p-4 shadow-[0_24px_80px_rgba(112,88,58,0.10)] sm:p-5 md:p-6">
          <form onSubmit={submitMessage} className="grid gap-3 md:grid-cols-[0.8fr_1.2fr_auto]">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-12 rounded-2xl border border-[#E0CFB8] bg-white/70 px-4 text-sm text-[#2B221A] outline-none transition placeholder:text-[#AA9984] focus:border-[#9A6B3F]"
              placeholder="你的名字"
              maxLength={40}
            />
            <input
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="h-12 rounded-2xl border border-[#E0CFB8] bg-white/70 px-4 text-sm text-[#2B221A] outline-none transition placeholder:text-[#AA9984] focus:border-[#9A6B3F]"
              placeholder="写一句留言"
              maxLength={280}
            />
            <button
              type="submit"
              disabled={isPosting}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#2B221A] px-5 text-sm font-bold text-[#FFF7E8] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {isPosting ? '发送中' : '发送'}
            </button>
          </form>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          <p className="mt-3 text-xs text-[#8F7E69]">{isLoading ? '正在加载留言...' : status}</p>
          <div className="message-scrollbar mt-6 max-h-[430px] space-y-3 overflow-y-auto pr-2">
            {messages.map((message) => (
              <article key={message.id} className="rounded-2xl border border-[#E0CFB8] bg-white/55 p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <h3 className="text-sm font-bold text-[#8C633F]">{message.name}</h3>
                  <time className="shrink-0 text-[11px] text-[#9B8A78]">
                    {new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' }).format(
                      new Date(message.created_at),
                    )}
                  </time>
                </div>
                <p className="text-sm leading-relaxed text-[#5F5144]">{message.content}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const works = [
  {
    title: '作品一：视觉练习',
    description: '把你的第一张作品图片放到 public/works/work-1.jpg，它会显示在这里。',
    src: assetPath('/works/work-1.jpg'),
    type: 'image',
  },
  {
    title: '作品二：趣味网站',
    description: '把你的第二张作品图片放到 public/works/work-2.jpg，用来展示网页或界面截图。',
    src: assetPath('/works/work-2.jpg'),
    type: 'image',
  },
  {
    title: '作品三：影像片段',
    description: '把视频作品放到 public/works/work-3.mp4，这张卡会自动以视频形式播放。',
    src: assetPath('/works/work-3.mp4'),
    type: 'video',
  },
  {
    title: '作品四：游戏开发',
    description: '把游戏截图放到 public/works/work-4.jpg，用来展示你的玩法、画面或关卡。',
    src: assetPath('/works/work-4.jpg'),
    type: 'image',
  },
] satisfies Array<{ title: string; description: string; src: string; type: 'image' | 'video' }>

function WorksPage({ onBack }: { onBack: () => void }) {
  const [loadedWorks, setLoadedWorks] = useState<Record<string, boolean>>({})

  return (
    <main className="min-h-screen bg-[#F8F1E6] px-4 py-6 text-[#2B221A] sm:px-6 md:py-8">
      <section className="mx-auto max-w-7xl rounded-[2rem] border border-[#E6D8C6] bg-[#FFF9EF] p-5 shadow-[0_30px_90px_rgba(112,88,58,0.14)] sm:p-8 md:p-10">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.28em] text-[#9A6B3F]">我的作品</p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-[#2B221A] sm:text-6xl md:text-7xl">
              创作现场与阶段成果
            </h1>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#2B221A] py-1 pl-5 pr-1 text-sm font-bold text-[#FFF7E8] transition hover:gap-3"
          >
            返回首页
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF7E8]">
              <ArrowRight className="h-4 w-4 rotate-180 text-[#2B221A]" />
            </span>
          </button>
        </div>
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-[#5F5144] sm:text-base">
          这里展示你的图片、视频、趣味网站截图和游戏开发成果。把文件放进 public/works 文件夹，并按下方文件名命名，就能替换示例槽位。
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {works.map((work, index) => (
            <motion.article
              key={work.title}
              className="overflow-hidden rounded-3xl border border-[#E0CFB8] bg-[#F4E9D8] shadow-[0_18px_55px_rgba(112,88,58,0.10)]"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative aspect-[4/3] bg-[#E9DCCB]">
                {work.type === 'video' ? (
                  <video
                    className="h-full w-full object-cover"
                    src={work.src}
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    onLoadedData={() => setLoadedWorks((current) => ({ ...current, [work.src]: true }))}
                    onError={() => setLoadedWorks((current) => ({ ...current, [work.src]: false }))}
                  />
                ) : (
                  <img
                    className="h-full w-full object-cover"
                    src={work.src}
                    alt={work.title}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    onLoad={() => setLoadedWorks((current) => ({ ...current, [work.src]: true }))}
                    onError={(event) => {
                      setLoadedWorks((current) => ({ ...current, [work.src]: false }))
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                )}
                {!loadedWorks[work.src] ? (
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm leading-relaxed text-[#6B5A48]">
                    <span className="rounded-2xl border border-dashed border-[#CDB99F] bg-[#FFF7EA]/90 p-4">
                      加载中
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="p-5 sm:p-6">
                <p className="mb-2 text-xs text-[#9A6B3F]">{String(index + 1).padStart(2, '0')}</p>
                <h2 className="text-2xl font-bold leading-tight text-[#2B221A]">{work.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#5F5144]">{work.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  )
}

const awardImages = [
  assetPath('/awards/honor-1.jpg'),
  assetPath('/awards/honor-2.jpg'),
  assetPath('/awards/honor-3.jpg'),
  assetPath('/awards/honor-4.jpg'),
]
const featuredPhoto = assetPath('/photos/featured-photo.jpg')

function calculateAge(birthday: string) {
  const birthDate = new Date(`${birthday}T00:00:00+08:00`)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())

  if (!hasBirthdayPassed) {
    age -= 1
  }

  return age
}

function DetailImage({ src, label, className = '' }: { src: string; label: string; className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-[#E0CFB8] bg-[#F4E9D8] ${className}`}>
      <img
        className="h-full w-full object-cover"
        src={src}
        alt={label}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={(event) => {
          setIsLoaded(false)
          event.currentTarget.style.display = 'none'
        }}
      />
      {!isLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center p-5 text-center text-sm leading-relaxed text-[#6B5A48]">
          <span className="rounded-2xl border border-dashed border-[#CDB99F] bg-[#FFF7EA]/90 p-4">加载中</span>
        </div>
      ) : null}
    </div>
  )
}

function DetailInfoPage({ onBack }: { onBack: () => void }) {
  const [awardIndex, setAwardIndex] = useState(0)
  const age = calculateAge('2008-11-24')

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAwardIndex((current) => (current + 1) % awardImages.length)
    }, 3200)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F1E6] px-4 py-5 text-[#2B221A] sm:px-6 md:py-6">
      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.5rem] border border-[#E6D8C6] bg-[#FFF9EF] p-4 shadow-[0_24px_70px_rgba(112,88,58,0.12)] sm:p-6 md:p-7">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[#D8B98E] opacity-50" />
        <div className="pointer-events-none absolute right-16 top-20 h-14 w-14 rotate-12 rounded-[1.25rem] border border-[#E4CDAF] opacity-60" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#F3DDBF]/45 blur-3xl" />
        <Sparkles className="pointer-events-none absolute left-8 top-8 h-6 w-6 text-[#B68A5B] opacity-70" />
        <Star className="pointer-events-none absolute bottom-12 right-10 h-7 w-7 text-[#B68A5B] opacity-60" />

        <div className="relative mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#9A6B3F]">详细信息</p>
            <h1 className="max-w-2xl text-4xl font-bold leading-[0.95] tracking-[-0.04em] text-[#2B221A] sm:text-5xl md:text-6xl">
              关于我的更多切面
            </h1>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#2B221A] py-1 pl-5 pr-1 text-sm font-bold text-[#FFF7E8] transition hover:gap-3"
          >
            返回首页
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF7E8]">
              <ArrowRight className="h-4 w-4 rotate-180 text-[#2B221A]" />
            </span>
          </button>
        </div>

        <div className="relative grid gap-4 lg:grid-cols-12">
          <div className="grid gap-3 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1">
            {[
              { icon: CalendarDays, label: '年龄', value: `${age} 岁` },
              { icon: Star, label: '星座', value: '射手座' },
              { icon: MapPin, label: '所在地', value: '山东淄博' },
              { icon: MessageCircle, label: 'QQ', value: '2467548120' },
              { icon: Mail, label: '邮箱', value: '2467548120@qq.com' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <article key={item.label} className="rounded-2xl border border-[#E0CFB8] bg-[#FFF7EA] p-4 shadow-[0_12px_32px_rgba(112,88,58,0.07)]">
                  <Icon className="mb-4 h-5 w-5 text-[#8C633F]" />
                  <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#9B8A78]">{item.label}</p>
                  <p className="break-all text-xl font-bold text-[#2B221A] sm:text-2xl">{item.value}</p>
                </article>
              )
            })}
            <article className="rounded-2xl border border-[#E0CFB8] bg-[#F4E9D8] p-4 shadow-[0_12px_32px_rgba(112,88,58,0.07)]">
              <Sparkles className="mb-4 h-5 w-5 text-[#8C633F]" />
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#9B8A78]">爱好</p>
              <div className="flex flex-wrap gap-2">
                {['乒乓球', '音乐', '电影', '设计'].map((hobby) => (
                  <span key={hobby} className="rounded-full border border-[#D8C2A8] bg-[#FFF7EA] px-3 py-1.5 text-sm font-bold text-[#5F5144]">
                    {hobby}
                  </span>
                ))}
              </div>
            </article>
          </div>

          <div className="grid gap-4 lg:col-span-5">
            <article className="rounded-2xl border border-[#E0CFB8] bg-[#F4E9D8] p-4 shadow-[0_14px_38px_rgba(112,88,58,0.08)] sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#9B8A78]">Awards</p>
                  <h2 className="mt-1 text-xl font-bold text-[#2B221A]">荣誉图片集</h2>
                </div>
                <Award className="h-6 w-6 text-[#8C633F]" />
              </div>
              <DetailImage src={awardImages[awardIndex]} label="荣誉图片" className="aspect-[16/10] rounded-2xl" />
              <div className="mt-3 flex justify-center gap-2">
                {awardImages.map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setAwardIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${index === awardIndex ? 'w-8 bg-[#2B221A]' : 'w-2.5 bg-[#CDB99F]'}`}
                    aria-label={`查看第 ${index + 1} 张荣誉图片`}
                  />
                ))}
              </div>
            </article>
          </div>

          <article className="rounded-2xl border border-[#E0CFB8] bg-[#FFF7EA] p-4 shadow-[0_14px_38px_rgba(112,88,58,0.08)] sm:p-5 lg:col-span-3">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#9B8A78]">Selected photos</p>
                  <h2 className="mt-1 text-xl font-bold text-[#2B221A]">精选照片</h2>
                </div>
                <Images className="h-6 w-6 text-[#8C633F]" />
            </div>
            <DetailImage src={featuredPhoto} label="精选竖版照片" className="aspect-[3/4] rounded-2xl" />
          </article>
        </div>
      </section>
    </main>
  )
}

const SECRET_VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_080827_a9e5ad52-b6ee-4e79-b393-d936f179cfd7.mp4'

function SecretSpacePage({ onBack }: { onBack: () => void }) {
  const [framesReady, setFramesReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoBgRef = useRef<HTMLDivElement>(null)
  const displayCanvasRef = useRef<HTMLCanvasElement>(null)
  const butterflyLayerRef = useRef<HTMLDivElement>(null)
  const framesRef = useRef<HTMLCanvasElement[]>([])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    let capturing = true
    let lastTime = -1
    let rafId = 0
    let videoFrameId = 0
    const maxWidth = 1920
    const frames: HTMLCanvasElement[] = []

    const captureFrame = () => {
      if (!capturing) return
      if (video.readyState >= 2 && video.currentTime !== lastTime && video.videoWidth > 0) {
        lastTime = video.currentTime
        const scale = Math.min(1, maxWidth / video.videoWidth)
        const width = Math.max(1, Math.round(video.videoWidth * scale))
        const height = Math.max(1, Math.round(video.videoHeight * scale))
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, width, height)
          frames.push(canvas)
        }
      }

      if ('requestVideoFrameCallback' in video) {
        videoFrameId = video.requestVideoFrameCallback(captureFrame)
      } else {
        rafId = window.requestAnimationFrame(captureFrame)
      }
    }

    const onLoaded = () => {
      void video.play().catch(() => {})
      captureFrame()
    }

    const onEnded = () => {
      capturing = false
      if (frames.length > 1) {
        framesRef.current = frames
        setFramesReady(true)
      }
    }

    video.addEventListener('loadedmetadata', onLoaded)
    video.addEventListener('ended', onEnded)
    if (video.readyState >= 1) onLoaded()

    return () => {
      capturing = false
      window.cancelAnimationFrame(rafId)
      if ('cancelVideoFrameCallback' in video && videoFrameId) {
        video.cancelVideoFrameCallback(videoFrameId)
      }
      video.removeEventListener('loadedmetadata', onLoaded)
      video.removeEventListener('ended', onEnded)
    }
  }, [])

  useEffect(() => {
    if (!framesReady) return undefined
    const canvas = displayCanvasRef.current
    const frames = framesRef.current
    if (!canvas || frames.length === 0) return undefined

    canvas.width = frames[0].width
    canvas.height = frames[0].height
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let index = 0
    let direction = 1
    let last = performance.now()
    const interval = 1000 / 30
    let rafId = 0

    const render = (now: number) => {
      if (now - last >= interval) {
        last = now
        ctx.drawImage(frames[index], 0, 0)
        index += direction
        if (index >= frames.length - 1) {
          index = frames.length - 1
          direction = -1
        }
        if (index <= 0) {
          index = 0
          direction = 1
        }
      }
      rafId = window.requestAnimationFrame(render)
    }

    rafId = window.requestAnimationFrame(render)
    return () => window.cancelAnimationFrame(rafId)
  }, [framesReady])

  useEffect(() => {
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    const strength = 90

    const onMouseMove = (event: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      targetX = ((event.clientX - cx) / cx) * strength
      targetY = ((event.clientY - cy) / cy) * strength
    }

    const tick = () => {
      currentX += (targetX - currentX) * 0.12
      currentY += (targetY - currentY) * 0.12
      if (videoBgRef.current) {
        gsap.set(videoBgRef.current, { x: currentX, y: currentY })
      }
      rafId = window.requestAnimationFrame(tick)
    }

    let rafId = window.requestAnimationFrame(tick)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.cancelAnimationFrame(rafId)
    }
  }, [])

  useEffect(() => {
    let lastSpawn = 0

    const onMouseMove = (event: MouseEvent) => {
      const now = performance.now()
      if (now - lastSpawn < 90) return
      lastSpawn = now

      const layer = butterflyLayerRef.current
      if (!layer) return

      const butterfly = document.createElement('span')
      const driftX = `${(Math.random() - 0.5) * 180}px`
      const driftY = `${-80 - Math.random() * 120}px`
      const rotate = `${(Math.random() - 0.5) * 80}deg`
      const size = `${18 + Math.random() * 18}px`
      const hue = `${34 + Math.random() * 58}`

      butterfly.className = 'butterfly-trail'
      butterfly.style.left = `${event.clientX}px`
      butterfly.style.top = `${event.clientY}px`
      butterfly.style.setProperty('--butterfly-x', driftX)
      butterfly.style.setProperty('--butterfly-y', driftY)
      butterfly.style.setProperty('--butterfly-rotate', rotate)
      butterfly.style.setProperty('--butterfly-size', size)
      butterfly.style.setProperty('--butterfly-hue', hue)
      layer.appendChild(butterfly)

      butterfly.addEventListener('animationend', () => butterfly.remove(), { once: true })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <div className="min-h-screen overflow-hidden bg-[#07120d] font-body text-white">
      <div ref={videoBgRef} className="fixed -inset-[140px] z-0 origin-center">
        <video
          ref={videoRef}
          src={SECRET_VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className="h-full w-full object-cover"
          style={{ display: framesReady ? 'none' : 'block' }}
        />
        <canvas ref={displayCanvasRef} className="h-full w-full object-cover" style={{ display: framesReady ? 'block' : 'none' }} />
      </div>

      <div ref={butterflyLayerRef} className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true" />

      <button
        type="button"
        onClick={onBack}
        className="fixed right-[40px] top-[32px] z-[9999] flex h-16 w-16 items-center justify-center rounded-full border border-white/55 bg-black/65 text-white shadow-[0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/80 active:scale-95"
        aria-label="返回首页"
      >
        <ArrowRight className="h-7 w-7 rotate-180" />
      </button>
    </div>
  )
}

function App() {
  const [page, setPage] = useState<'home' | 'works' | 'details' | 'secret'>('home')

  if (page === 'works') {
    return <WorksPage onBack={() => setPage('home')} />
  }

  if (page === 'details') {
    return <DetailInfoPage onBack={() => setPage('home')} />
  }

  if (page === 'secret') {
    return <SecretSpacePage onBack={() => setPage('home')} />
  }

  return (
    <main className="min-h-screen bg-[#F8F1E6] text-[#2B221A]">
      <Hero />
      <About onOpenSecret={() => setPage('secret')} />
      <PersonalInfo onOpenDetails={() => setPage('details')} />
      <Features onOpenWorks={() => setPage('works')} />
      <MessageBoard />
    </main>
  )
}

export default App
