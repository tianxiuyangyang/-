import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import {
  ArrowRight,
  Award,
  Bird,
  CalendarDays,
  Check,
  Clapperboard,
  Clock3,
  Copy,
  Disc3,
  Download,
  FileDown,
  Globe2,
  Images,
  Leaf,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  QrCode,
  Pause,
  Play,
  PackageOpen,
  Star,
  Send,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from 'lucide-react'
import './App.css'
import { loadStoredMessages, mergeMessages, messageStorageKey, saveStoredMessages } from './messageStorage'

const ink = '#2B221A'
const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
const portfolioUrl = 'https://hdjajbx.github.io/guanyifei-portfolio/'
const funWebsites = [
  { name: '个人作品集', url: portfolioUrl },
  { name: '宝石矿场', url: 'https://tianxiuyangyang.github.io/gem-mine/' },
]
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

type WarehouseItem = {
  name: string
  file: string
  description?: string
  size?: string
  restricted?: boolean
}

type GeneratedImage = {
  src: string
  prompt: string
  model: string
  size: string
  createdAt: string
  revisedPrompt?: string
}

const warehouseManifestUrl = assetPath('/warehouse/manifest.json')
const imageApiModels = ['gpt-image-2-auto', 'gpt-image-2', 'gpt-image-2-eco'] as const
const imageApiSizes = ['1024x1024', '1536x1024', '1024x1536'] as const

const deletedMessagesKey = 'prisma-deleted-message-ids'

const getDeletedMessageIds = () => {
  if (typeof window === 'undefined') return new Set<string>()
  try {
    const savedIds = window.localStorage.getItem(deletedMessagesKey)
    const parsed: unknown = savedIds ? JSON.parse(savedIds) : []
    return new Set(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [])
  } catch {
    return new Set<string>()
  }
}

const rememberDeletedMessage = (messageId: string) => {
  const deletedIds = getDeletedMessageIds()
  deletedIds.add(messageId)
  window.localStorage.setItem(deletedMessagesKey, JSON.stringify(Array.from(deletedIds)))
}

const removeDeletedMessages = (messages: Message[]) => {
  const deletedIds = getDeletedMessageIds()
  return messages.filter((message) => !deletedIds.has(message.id))
}

const getBrowserMessages = () => {
  if (typeof window === 'undefined') return demoMessages
  const savedMessages = loadStoredMessages(window.localStorage)
  if (window.localStorage.getItem(messageStorageKey) !== null) {
    return removeDeletedMessages(savedMessages)
  }
  return removeDeletedMessages(demoMessages)
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
  color = ink,
  textShadow,
}: {
  text: string
  className?: string
  showAsterisk?: boolean
  color?: string
  textShadow?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const words = text.split(' ')

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={{ color, textShadow }}>
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
  const [heroVideoReady, setHeroVideoReady] = useState(false)
  const navItems = [
    { label: '我的故事', href: '#our-story' },
    { label: '个人信息', href: '#collective' },
    { label: '创作能力', href: '#workshops' },
    { label: '项目方向', href: '#programs' },
    { label: 'AI 生图', href: '#image-lab' },
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
        <img
          src={assetPath('works/work-2.jpg')}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          aria-hidden="true"
        />
        <video
          ref={heroVideoRef}
          className={`hero-video absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${heroVideoReady ? 'opacity-100' : 'opacity-0'}`}
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlayThrough={() => setHeroVideoReady(true)}
          onError={() => setHeroVideoReady(false)}
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
                color="#FFB347"
                textShadow="0 3px 18px rgba(43, 34, 26, 0.78)"
                className="translate-x-[2vw] -translate-y-[2vh] text-[19.5vw] font-medium leading-[0.85] tracking-[-0.07em] sm:text-[18vw] md:text-[16.5vw] lg:text-[15vw] xl:text-[14.25vw] 2xl:text-[15vw]"
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

function About({ onOpenSecret, onOpenWarehouse }: { onOpenSecret: () => void; onOpenWarehouse: () => void }) {
  const [isSupportOpen, setIsSupportOpen] = useState(false)

  return (
    <section id="our-story" className="bg-[#F8F1E6] px-4 py-20 sm:px-6 md:py-28">
      <div className="relative mx-auto max-w-6xl rounded-[1.75rem] border border-[#E6D8C6] bg-[#FFF9EF] px-6 py-16 text-center shadow-[0_24px_80px_rgba(112,88,58,0.12)] sm:px-10 md:py-24">
        <div className="decor-lighthouse" aria-hidden="true">
          <span className="decor-lighthouse__beam decor-lighthouse__beam--left" />
          <span className="decor-lighthouse__beam decor-lighthouse__beam--right" />
          <span className="decor-lighthouse__roof" />
          <span className="decor-lighthouse__light" />
          <span className="decor-lighthouse__tower" />
          <span className="decor-lighthouse__base" />
        </div>
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
        <button
          type="button"
          onClick={onOpenWarehouse}
          className="group absolute bottom-4 right-4 z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#DECDB6] bg-[#FFF7EA]/90 text-[#2B221A] shadow-[0_16px_38px_rgba(92,70,43,0.14)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white sm:bottom-6 sm:right-6"
          aria-label="打开仓库"
          title="仓库"
        >
          <PackageOpen className="h-6 w-6 transition-transform group-hover:scale-110" />
        </button>
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

function WarehousePage({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<WarehouseItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [isAdminPromptOpen, setIsAdminPromptOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadWarehouse = async () => {
      try {
        const response = await fetch(warehouseManifestUrl, { cache: 'no-cache' })
        if (!response.ok) throw new Error('warehouse manifest missing')
        const data = (await response.json()) as unknown
        const nextItems = Array.isArray(data)
          ? data.filter((item): item is WarehouseItem => {
              if (!item || typeof item !== 'object') return false
              const record = item as Record<string, unknown>
              return (
                typeof record.name === 'string' &&
                typeof record.file === 'string' &&
                (record.restricted === undefined || typeof record.restricted === 'boolean')
              )
            })
          : []

        if (isMounted) {
          setItems(nextItems)
        }
      } catch {
        if (isMounted) {
          setItems([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadWarehouse()

    return () => {
      isMounted = false
    }
  }, [])

  const submitAdminPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (adminPassword.trim() !== '3180') {
      setAdminError('密码不正确。')
      return
    }

    setIsAdminMode(true)
    setAdminPassword('')
    setAdminError('')
    setIsAdminPromptOpen(false)
  }

  return (
    <main className="min-h-screen bg-[#F8F1E6] px-4 py-6 text-[#2B221A] sm:px-6 md:py-8">
      <section className="mx-auto max-w-6xl rounded-[1.75rem] border border-[#E6D8C6] bg-[#FFF9EF] p-5 shadow-[0_24px_80px_rgba(112,88,58,0.10)] sm:p-8 md:p-10">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#2B221A] py-1 pl-5 pr-1 text-sm font-bold text-[#FFF7E8] transition hover:gap-3"
        >
          返回首页
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF7E8]">
            <ArrowRight className="h-4 w-4 rotate-180 text-[#2B221A]" />
          </span>
        </button>
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2B221A] text-[#FFF7E8] shadow-[0_14px_35px_rgba(92,70,43,0.16)]">
              <PackageOpen className="h-6 w-6" />
            </div>
            <p className="text-xs uppercase tracking-[0.26em] text-[#9A6B3F]">Download warehouse</p>
            <h2 className="mt-3 text-4xl font-bold leading-tight text-[#2B221A] sm:text-5xl">仓库</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#6B5A49]">
            我会把可公开分享的文件放在这里，访问者可以直接下载资料、作品附件和阶段性整理文件。
          </p>
        </div>
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#E0CFB8] bg-[#FFF7EA] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-[#6B5A49]">
            {isAdminMode ? '管理员模式已开启，专属文件已显示。' : '部分文件需要管理员权限才能访问。'}
          </p>
          <button
            type="button"
            onClick={() => {
              if (isAdminMode) {
                setIsAdminMode(false)
                setIsAdminPromptOpen(false)
                setAdminPassword('')
                setAdminError('')
                return
              }
              setIsAdminPromptOpen((current) => !current)
            }}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#D7C4AA] bg-white px-4 py-2 text-xs font-bold text-[#5F5144] transition hover:bg-[#F4E9D8]"
          >
            <Lock className="h-3.5 w-3.5" />
            {isAdminMode ? '退出管理员' : '管理员访问'}
          </button>
        </div>
        {isAdminPromptOpen ? (
          <form
            onSubmit={submitAdminPassword}
            className="mb-6 flex flex-col gap-2 rounded-2xl border border-[#B9D5EE] bg-[#EEF8FF] p-4 sm:flex-row"
          >
            <input
              value={adminPassword}
              onChange={(event) => {
                setAdminPassword(event.target.value)
                setAdminError('')
              }}
              className="h-11 flex-1 rounded-2xl border border-[#B9D5EE] bg-white px-4 text-sm text-[#2B221A] outline-none transition placeholder:text-[#91A8BB] focus:border-[#5680A6]"
              placeholder="输入管理员密码"
              type="password"
            />
            <button type="submit" className="h-11 rounded-2xl bg-[#315D86] px-5 text-sm font-bold text-white transition hover:bg-[#254A6D]">
              解锁
            </button>
            {adminError ? <p className="self-center text-xs text-red-600">{adminError}</p> : null}
          </form>
        ) : null}

        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-[#D8C4A8] bg-[#FFF7EA] p-6 text-sm text-[#6B5A49]">
            正在读取仓库清单...
          </div>
        ) : items.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => {
              const href = assetPath(`/warehouse/${item.file}`)
              const isLocked = item.restricted && !isAdminMode
              return (
                <article
                  key={`${item.file}-${item.name}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-[#E0CFB8] bg-[#FFF7EA] p-4 shadow-[0_12px_32px_rgba(112,88,58,0.07)]"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#8C633F]">
                      <FileDown className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="flex items-center gap-2 truncate text-sm font-bold text-[#2B221A]">
                        <span className="truncate">{item.name}</span>
                        {item.restricted ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#E8F3FF] px-2 py-0.5 text-[10px] text-[#315D86]">
                            <Lock className="h-3 w-3" />
                            管理员
                          </span>
                        ) : null}
                      </h3>
                      {item.description ? (
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#6B5A49]">{item.description}</p>
                      ) : null}
                      {item.size ? <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#9B8A78]">{item.size}</p> : null}
                    </div>
                  </div>
                  {isLocked ? (
                    <button
                      type="button"
                      onClick={() => setIsAdminPromptOpen(true)}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F3FF] text-[#315D86] transition hover:-translate-y-0.5 hover:bg-[#D5E9FA]"
                      aria-label={`${item.name} 需要管理员权限`}
                      title="需要管理员权限"
                    >
                      <Lock className="h-4 w-4" />
                    </button>
                  ) : (
                    <a
                      href={href}
                      download
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2B221A] text-[#FFF7E8] transition hover:-translate-y-0.5 hover:bg-[#443326]"
                      aria-label={`下载 ${item.name}`}
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#D8C4A8] bg-[#FFF7EA] p-6 text-sm leading-relaxed text-[#6B5A49]">
            仓库暂时是空的。把文件放到 <span className="font-bold text-[#2B221A]">public/warehouse</span>，再在{' '}
            <span className="font-bold text-[#2B221A]">manifest.json</span> 里添加名称和文件名，部署后访客就能下载。
          </div>
        )}
      </section>
    </main>
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
        <div className="mb-6 flex justify-center lg:justify-end">
          <RecordPlayer />
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

function getImageApiConfig() {
  return {
    baseUrl: import.meta.env.VITE_IMAGE_API_BASE_URL as string | undefined,
    key: import.meta.env.VITE_IMAGE_API_KEY as string | undefined,
  }
}

function normalizeImageSource(url?: string, base64?: string) {
  if (url) return url
  if (base64) return `data:image/png;base64,${base64}`
  return ''
}

function ImageLab() {
  const config = useMemo(getImageApiConfig, [])
  const [prompt, setPrompt] = useState('暖白色电影感个人网站首页，清晨光线，极简排版，细腻质感')
  const [model, setModel] = useState<(typeof imageApiModels)[number]>('gpt-image-2-auto')
  const [size, setSize] = useState<(typeof imageApiSizes)[number]>('1024x1024')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('AI 生图仅限管理员使用。')
  const [gallery, setGallery] = useState<GeneratedImage[]>([])
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [isAdminPromptOpen, setIsAdminPromptOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')

  const hasImageApi = Boolean(config.baseUrl && config.key)
  const latestImage = gallery[0]

  const submitGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isAdminMode) {
      setError('需要管理员权限才能使用 AI 生图。')
      setIsAdminPromptOpen(true)
      return
    }

    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt) {
      setError('先写一点你想生成的画面描述。')
      return
    }
    if (!hasImageApi || !config.baseUrl || !config.key) {
      setError('当前没有检测到生图渠道配置。')
      return
    }

    setIsGenerating(true)
    setError('')
    setStatus('正在生成图片，通常需要十几秒。')

    try {
      const response = await fetch(`${config.baseUrl.replace(/\/+$/, '')}/v1/images/generations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt: trimmedPrompt,
          size,
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | {
            data?: Array<{ url?: string; b64_json?: string; revised_prompt?: string }>
            error?: { message?: string }
          }
        | null

      if (!response.ok) {
        throw new Error(payload?.error?.message || '图片生成失败，请稍后再试。')
      }

      const item = payload?.data?.[0]
      const src = normalizeImageSource(item?.url, item?.b64_json)
      if (!src) {
        throw new Error('接口已返回成功，但没有拿到图片地址。')
      }

      const nextImage: GeneratedImage = {
        src,
        prompt: trimmedPrompt,
        model,
        size,
        createdAt: new Date().toISOString(),
        revisedPrompt: item?.revised_prompt,
      }

      setGallery((current) => [nextImage, ...current].slice(0, 6))
      setStatus('图片生成完成，可以继续修改提示词再出新版本。')
    } catch (generationError) {
      const message = generationError instanceof Error ? generationError.message : '图片生成失败，请稍后再试。'
      setError(message)
      setStatus('这次请求没有成功，调整提示词或稍后重试即可。')
    } finally {
      setIsGenerating(false)
    }
  }

  const submitAdminPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (adminPassword.trim() !== '3180') {
      setAdminError('密码不正确。')
      return
    }

    setIsAdminMode(true)
    setIsAdminPromptOpen(false)
    setAdminPassword('')
    setAdminError('')
    setError('')
    setStatus('管理员模式已开启，可以使用 AI 生图。')
  }

  const exitAdminMode = () => {
    setIsAdminMode(false)
    setIsAdminPromptOpen(false)
    setAdminPassword('')
    setAdminError('')
    setError('')
    setStatus('AI 生图仅限管理员使用。')
  }

  return (
    <section id="image-lab" className="relative overflow-hidden bg-[#F8F1E6] px-4 py-20 sm:px-6 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-[0.14]">
        <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-[#F0D7B5] blur-3xl" />
        <div className="absolute right-0 top-1/3 h-56 w-56 rounded-full bg-[#E6D8FF]/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-52 w-52 rounded-full bg-[#D4E8D1]/45 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <article className="overflow-hidden rounded-[1.75rem] border border-[#E6D8C6] bg-[#FFF9EF] p-6 shadow-[0_24px_80px_rgba(112,88,58,0.12)] sm:p-8 md:p-10">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#2B221A] text-[#FFF7E8]">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="mb-4 text-xs uppercase tracking-[0.28em] text-[#9B8A78]">AI Image Lab</p>
          <h2 className="max-w-xl text-4xl leading-[0.95] text-[#2B221A] sm:text-5xl md:text-6xl">
            把灵感直接生成为画面。
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-[#5F5144] sm:text-base">
            这里已经接上你的生图渠道。输入一句提示词，选择尺寸和模型，就能直接调用 `gpt-image-2` 系列生成图片。
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs text-[#8C633F]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DECDB6] bg-[#FFF6E8] px-3 py-2">
              <Sparkles className="h-3.5 w-3.5" /> OpenAI 兼容
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DECDB6] bg-[#FFF6E8] px-3 py-2">
              <Images className="h-3.5 w-3.5" /> 返回原图链接
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DECDB6] bg-[#FFF6E8] px-3 py-2">
              <Lock className="h-3.5 w-3.5" /> 仅限管理员
            </span>
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                if (isAdminMode) {
                  exitAdminMode()
                  return
                }
                setIsAdminPromptOpen((current) => !current)
                setAdminError('')
              }}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${
                isAdminMode ? 'bg-[#DCEEFF] text-[#315D86]' : 'bg-[#2B221A] text-[#FFF7E8]'
              }`}
            >
              <Lock className="h-4 w-4" />
              {isAdminMode ? '退出管理员模式' : '管理员解锁'}
            </button>
            {isAdminPromptOpen && !isAdminMode ? (
              <form
                onSubmit={submitAdminPassword}
                className="mt-3 grid max-w-sm gap-3 rounded-2xl border border-[#B9D5EE] bg-white/75 p-4 shadow-[0_12px_30px_rgba(70,118,160,0.12)]"
              >
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                  className="h-11 rounded-xl border border-[#B9D5EE] bg-white px-4 text-sm text-[#2B221A] outline-none focus:border-[#5680A6]"
                  placeholder="输入管理员密码"
                  autoFocus
                />
                <div className="flex items-center justify-between gap-3">
                  {adminError ? <p className="text-xs text-red-600">{adminError}</p> : <span />}
                  <button type="submit" className="rounded-full bg-[#315D86] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#244A6B]">
                    验证
                  </button>
                </div>
              </form>
            ) : null}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              '电影感人物肖像，暖金色逆光，浅景深，细腻皮肤质感',
              '极简产品海报，米白背景，真实阴影，杂志版式',
              '未来感房间场景，玻璃与金属材质，体积光，高清',
            ].map((idea) => (
              <button
                key={idea}
                type="button"
                onClick={() => setPrompt(idea)}
                disabled={!isAdminMode}
                className="rounded-2xl border border-[#E0CFB8] bg-[#FFF7EA] p-4 text-left text-sm leading-relaxed text-[#5F5144] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
              >
                {idea}
              </button>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-[#7B6B59]">{status}</p>
          {!hasImageApi ? <p className="mt-2 text-sm text-red-600">未检测到 `VITE_IMAGE_API_BASE_URL` 或 `VITE_IMAGE_API_KEY`。</p> : null}
        </article>

        <article className="overflow-hidden rounded-[1.75rem] border border-[#E6D8C6] bg-[#FFF7EA] p-4 shadow-[0_24px_80px_rgba(112,88,58,0.10)] sm:p-5 md:p-6">
          <form onSubmit={submitGenerate} className="grid gap-3">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              disabled={!isAdminMode}
              className="min-h-[128px] rounded-[1.5rem] border border-[#E0CFB8] bg-white/80 px-4 py-4 text-sm leading-relaxed text-[#2B221A] outline-none transition placeholder:text-[#AA9984] focus:border-[#9A6B3F]"
              placeholder="例如：一张带有电影感的个人主页首屏，暖白背景，立体排版，微风吹动纱帘。"
              maxLength={600}
            />
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <label className="grid gap-2 text-sm text-[#5F5144]">
                <span className="font-bold text-[#2B221A]">模型</span>
                <select
                  value={model}
                  onChange={(event) => setModel(event.target.value as (typeof imageApiModels)[number])}
                  disabled={!isAdminMode}
                  className="h-12 rounded-2xl border border-[#E0CFB8] bg-white/80 px-4 text-sm text-[#2B221A] outline-none transition focus:border-[#9A6B3F]"
                >
                  {imageApiModels.map((modelOption) => (
                    <option key={modelOption} value={modelOption}>
                      {modelOption}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-[#5F5144]">
                <span className="font-bold text-[#2B221A]">尺寸</span>
                <select
                  value={size}
                  onChange={(event) => setSize(event.target.value as (typeof imageApiSizes)[number])}
                  disabled={!isAdminMode}
                  className="h-12 rounded-2xl border border-[#E0CFB8] bg-white/80 px-4 text-sm text-[#2B221A] outline-none transition focus:border-[#9A6B3F]"
                >
                  {imageApiSizes.map((sizeOption) => (
                    <option key={sizeOption} value={sizeOption}>
                      {sizeOption}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                disabled={isGenerating || !isAdminMode}
                className="inline-flex h-12 items-center justify-center gap-2 self-end rounded-2xl bg-[#2B221A] px-5 text-sm font-bold text-[#FFF7E8] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAdminMode ? <Sparkles className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {isGenerating ? '生成中' : isAdminMode ? '立即生图' : '需要管理员权限'}
              </button>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs text-[#8C633F]">
              <span>提示词上限 600 字，建议描述主体、光线、镜头和材质。</span>
              <span>{prompt.trim().length}/600</span>
            </div>
            {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
          </form>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="overflow-hidden rounded-[1.5rem] border border-[#E0CFB8] bg-[#F4E9D8]">
              <div className="relative aspect-square bg-[#E9DCCB]">
                {latestImage ? (
                  <img className="h-full w-full object-cover" src={latestImage.src} alt={latestImage.prompt} loading="eager" decoding="async" />
                ) : (
                  <div className="flex h-full items-center justify-center p-8 text-center text-sm leading-relaxed text-[#6B5A48]">
                    <span className="rounded-2xl border border-dashed border-[#CDB99F] bg-[#FFF7EA]/90 p-4">
                      生成后的图片会显示在这里。
                    </span>
                  </div>
                )}
              </div>
              <div className="grid gap-3 border-t border-[#E0CFB8] bg-[#FFF9EF] p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C633F]">
                  <span className="rounded-full border border-[#DECDB6] bg-[#FFF6E8] px-3 py-1.5">{latestImage?.model || '等待生成'}</span>
                  <span className="rounded-full border border-[#DECDB6] bg-[#FFF6E8] px-3 py-1.5">{latestImage?.size || '1024x1024'}</span>
                </div>
                <p className="text-sm leading-relaxed text-[#5F5144]">{latestImage?.prompt || '写一个足够具体的提示词，图片会更稳定。'}</p>
                {latestImage?.revisedPrompt ? (
                  <p className="text-xs leading-relaxed text-[#8C633F]">接口优化后的提示词：{latestImage.revisedPrompt}</p>
                ) : null}
                {latestImage ? (
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={latestImage.src}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#2B221A] px-4 py-2 text-sm font-bold text-[#FFF7E8] transition hover:scale-[1.02]"
                    >
                      <Download className="h-4 w-4" />
                      打开原图
                    </a>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3">
              {gallery.length > 0 ? (
                gallery.slice(0, 3).map((image) => (
                  <article key={`${image.createdAt}-${image.src}`} className="grid grid-cols-[92px_1fr] gap-3 rounded-[1.5rem] border border-[#E0CFB8] bg-[#FFF9EF] p-3 shadow-[0_10px_28px_rgba(112,88,58,0.06)]">
                    <img className="h-[92px] w-[92px] rounded-2xl object-cover" src={image.src} alt={image.prompt} loading="lazy" decoding="async" />
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#9B8A78]">{image.model}</p>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#5F5144]">{image.prompt}</p>
                      <a href={image.src} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#8C633F]">
                        查看图片
                        <ArrowRight className="h-4 w-4 -rotate-45" />
                      </a>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-[#CDB99F] bg-[#FFF9EF] p-5 text-sm leading-relaxed text-[#6B5A48]">
                  这里会保留最近生成的几张图，方便你快速比较版本。
                </div>
              )}
            </div>
          </div>
        </article>
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
  const [messages, setMessages] = useState<Message[]>(getBrowserMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('')
  const config = useMemo(getSupabaseConfig, [])
  const hasSupabase = Boolean(config.url && config.key)

  useEffect(() => {
    const savedMessages = removeDeletedMessages(loadStoredMessages(window.localStorage))
    if (!hasSupabase || !config.url || !config.key) {
      if (savedMessages.length > 0) {
        setMessages(savedMessages)
        setStatus('已加载本机保存的留言。')
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
        const mergedMessages = removeDeletedMessages(mergeMessages(data, savedMessages))
        setMessages(mergedMessages)
        saveStoredMessages(window.localStorage, mergedMessages)
        setStatus('公开留言板已连接。')
      } catch {
        if (savedMessages.length > 0) {
          setMessages(savedMessages)
          setStatus('暂时无法连接 Supabase，已显示本机保存的留言。')
        } else {
          setStatus('暂时无法连接 Supabase，当前显示本地演示留言。')
        }
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
      const nextMessages = mergeMessages([nextMessage], messages)
      setMessages(nextMessages)
      saveStoredMessages(window.localStorage, nextMessages)
      setStatus('已保存到本机。部署前添加 Supabase 配置后，留言会变成公开共享。')
      return
    }

    const supabaseUrl = config.url
    const supabaseKey = config.key

    const optimisticMessages = mergeMessages([nextMessage], messages)
    setMessages(optimisticMessages)
    saveStoredMessages(window.localStorage, optimisticMessages)

    try {
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
      const syncedMessages = mergeMessages([savedMessage], optimisticMessages)
      setMessages(syncedMessages)
      saveStoredMessages(window.localStorage, syncedMessages)
      setStatus('留言已发布，所有访客都可以看到。')
    } catch {
      setStatus('网络暂时不可用，留言已先保存到本机。')
    }
  }

  const deleteMessage = (messageId: string) => {
    rememberDeletedMessage(messageId)
    setMessages((currentMessages) => {
      const nextMessages = currentMessages.filter((message) => message.id !== messageId)
      if (typeof window !== 'undefined') {
        saveStoredMessages(window.localStorage, nextMessages)
      }
      return nextMessages
    })
    setStatus('管理员模式：留言已删除。')
  }

  return { messages, addMessage, deleteMessage, isLoading, status }
}

function MessageBoard() {
  const { messages, addMessage, deleteMessage, isLoading, status } = useMessages()
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState('')
  const [isAdminPromptOpen, setIsAdminPromptOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')
  const [isAdminMode, setIsAdminMode] = useState(false)

  useEffect(() => {
    window.localStorage.removeItem('prisma-admin-mode')
  }, [])

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

  const submitAdminPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (adminPassword.trim() !== '3180') {
      setAdminError('密码不正确。')
      return
    }

    setIsAdminMode(true)
    setAdminPassword('')
    setAdminError('')
    setIsAdminPromptOpen(false)
  }

  return (
    <section
      id="inquiries"
      className={`px-4 py-20 transition-colors duration-500 sm:px-6 md:py-28 ${isAdminMode ? 'bg-[#DCEEFF]' : 'bg-[#F8F1E6]'}`}
    >
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div
          className={`rounded-[1.75rem] border p-6 shadow-[0_24px_80px_rgba(112,88,58,0.12)] transition-colors duration-500 sm:p-8 md:p-10 ${
            isAdminMode ? 'border-[#9CC9F2] bg-[#F3FAFF]' : 'border-[#E6D8C6] bg-[#FFF9EF]'
          }`}
        >
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
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#DECDB6] bg-[#FFF6E8] px-4 py-2 text-sm font-bold text-[#2B221A] shadow-[0_10px_26px_rgba(112,88,58,0.08)]">
            <MessageCircle className="h-4 w-4 text-[#8C633F]" />
            QQ：2467548120，请加 QQ 联系
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

        <div
          className={`rounded-[1.75rem] border p-4 shadow-[0_24px_80px_rgba(112,88,58,0.10)] transition-colors duration-500 sm:p-5 md:p-6 ${
            isAdminMode ? 'border-[#9CC9F2] bg-[#EEF8FF]' : 'border-[#E6D8C6] bg-[#FFF7EA]'
          }`}
        >
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
            <div className="relative flex flex-col items-stretch">
              <button
                type="button"
                onClick={() => {
                  if (isAdminMode) {
                    setIsAdminMode(false)
                    setIsAdminPromptOpen(false)
                    setAdminPassword('')
                    setAdminError('')
                    return
                  }
                  setIsAdminPromptOpen(true)
                }}
                className="admin-bird-button absolute -top-10 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#D5E5F4] bg-white/45 text-[#5680A6] opacity-35 shadow-[0_8px_18px_rgba(68,110,150,0.16)] transition hover:scale-110 hover:bg-white hover:opacity-100"
                aria-label="管理员入口"
              >
                <Bird className="h-4 w-4" />
              </button>
              <button
                type="submit"
                disabled={isPosting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#2B221A] px-5 text-sm font-bold text-[#FFF7E8] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {isPosting ? '发送中' : '发送'}
              </button>
            </div>
          </form>
          {isAdminPromptOpen ? (
            <form
              onSubmit={submitAdminPassword}
              className="mt-4 rounded-2xl border border-[#B9D5EE] bg-white/75 p-4 shadow-[0_12px_30px_rgba(70,118,160,0.12)]"
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-sm font-bold text-[#315D86]">密码</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminPromptOpen(false)
                    setAdminPassword('')
                    setAdminError('')
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8F3FF] text-[#315D86] transition hover:bg-[#D5E9FA]"
                  aria-label="关闭管理员密码输入"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={adminPassword}
                  onChange={(event) => {
                    setAdminPassword(event.target.value)
                    setAdminError('')
                  }}
                  className="h-11 flex-1 rounded-2xl border border-[#B9D5EE] bg-white px-4 text-sm text-[#2B221A] outline-none transition placeholder:text-[#91A8BB] focus:border-[#5680A6]"
                  placeholder="输入密码"
                  type="password"
                />
                <button type="submit" className="h-11 rounded-2xl bg-[#315D86] px-5 text-sm font-bold text-white transition hover:bg-[#244C70]">
                  进入
                </button>
              </div>
              {adminError ? <p className="mt-2 text-xs text-red-600">{adminError}</p> : null}
            </form>
          ) : null}
          {isAdminMode ? (
            <p className="mt-3 rounded-2xl border border-[#B9D5EE] bg-[#E8F3FF] px-4 py-2 text-xs font-bold text-[#315D86]">
              管理员模式已开启，可以删除留言。
            </p>
          ) : null}
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          {isLoading || status ? <p className="mt-3 text-xs text-[#8F7E69]">{isLoading ? '正在加载留言...' : status}</p> : null}
          <div className="message-scrollbar mt-6 max-h-[430px] space-y-3 overflow-y-auto pr-2">
            {messages.map((message) => (
              <article key={message.id} className="rounded-2xl border border-[#E0CFB8] bg-white/55 p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <h3 className="text-sm font-bold text-[#8C633F]">{message.name}</h3>
                  <div className="flex shrink-0 items-center gap-2">
                    <time className="text-[11px] text-[#9B8A78]">
                      {new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' }).format(
                        new Date(message.created_at),
                      )}
                    </time>
                    {isAdminMode ? (
                      <button
                        type="button"
                        onClick={() => deleteMessage(message.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8F3FF] text-[#315D86] transition hover:bg-red-50 hover:text-red-600"
                        aria-label={`删除 ${message.name} 的留言`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
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
    title: '作品一：游戏开发',
    src: assetPath('/works/work-1.png'),
    type: 'image',
  },
  {
    title: '作品二：趣味网站',
    src: portfolioUrl,
    type: 'link',
  },
  {
    title: '作品三：影像片段',
    src: assetPath('/works/work-3.mp4'),
    type: 'video',
  },
  {
    title: '作品四：游戏设计',
    src: assetPath('/works/work-4.jpg'),
    type: 'image',
  },
] satisfies Array<{ title: string; description?: string; src: string; type: 'image' | 'video' | 'link' }>

const worksMusicSrc = assetPath('/music/works-player.mp3')
const mistCityMovieSrc = assetPath('/warehouse/迷雾都城 · 上部-暗黑传说.zip')
const mistCityPosterSrc = assetPath('/works/mist-city-poster.jpg')

function RecordPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasAudioError, setHasAudioError] = useState(false)

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return

    setHasAudioError(false)

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    try {
      await audio.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
      setHasAudioError(true)
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <button
        type="button"
        onClick={togglePlayback}
        className={`record-player group relative inline-flex items-center gap-3 rounded-full border border-[#D8C2A8] bg-[#FFF7EA] py-2 pl-2 pr-4 text-left text-[#2B221A] shadow-[0_16px_38px_rgba(112,88,58,0.12)] transition hover:-translate-y-0.5 hover:bg-white ${isPlaying ? 'is-playing' : ''}`}
        aria-label={isPlaying ? '暂停作品页音乐' : '播放作品页音乐'}
        aria-pressed={isPlaying}
      >
        <span className="record-player__turntable flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#2B221A] shadow-inner">
          <span className="record-player__disc relative flex h-12 w-12 items-center justify-center rounded-full border border-[#8C633F] bg-[#17110C]">
            <span className="absolute h-8 w-8 rounded-full border border-[#4A3526]" />
            <span className="absolute h-4 w-4 rounded-full bg-[#C79B63]" />
            <Disc3 className="relative h-7 w-7 text-[#FFF7E8]/80" aria-hidden="true" />
          </span>
        </span>
        <span className="min-w-0">
          <span className="block text-xs uppercase tracking-[0.22em] text-[#9A6B3F]">Music</span>
          <span className="mt-1 flex items-center gap-2 text-sm font-bold text-[#2B221A]">
            {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            {isPlaying ? '正在播放' : '播放音乐'}
          </span>
        </span>
      </button>
      {hasAudioError ? (
        <p className="max-w-[13rem] text-xs leading-relaxed text-[#8C633F] sm:text-right">
          请将音乐文件放到 public/music/works-player.mp3
        </p>
      ) : null}
      <audio
        ref={audioRef}
        src={worksMusicSrc}
        preload="metadata"
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false)
          setHasAudioError(true)
        }}
      />
    </div>
  )
}

function WorksPage({ onBack }: { onBack: () => void }) {
  const [loadedWorks, setLoadedWorks] = useState<Record<string, boolean>>({})
  const [copiedWork, setCopiedWork] = useState<string | null>(null)

  return (
    <main className="works-page min-h-screen overflow-y-auto overflow-x-hidden bg-[#F8F1E6] px-4 py-6 text-[#2B221A] sm:px-6 md:py-8">
      <section className="mx-auto max-w-7xl overflow-visible rounded-[2rem] border border-[#E6D8C6] bg-[#FFF9EF] p-5 pb-10 shadow-[0_30px_90px_rgba(112,88,58,0.14)] sm:p-8 sm:pb-12 md:p-10 md:pb-14">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.28em] text-[#9A6B3F]">我的作品</p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-[#2B221A] sm:text-6xl md:text-7xl">
              创作现场与阶段成果
            </h1>
          </div>
          <RecordPlayer />
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
                {work.type === 'link' ? (
                  <div className="flex h-full flex-col justify-center gap-3 bg-[#E8F3FF] p-4 sm:p-5">
                    {funWebsites.map((website) => (
                      <div
                        key={website.url}
                        className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#BCD5E9] bg-white/70 p-3 text-left shadow-sm"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D5E9F8] text-[#315D86]">
                          <Globe2 className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <a
                          href={website.url}
                          target="_blank"
                          rel="noreferrer"
                          className="min-w-0 flex-1 text-[#315D86] transition hover:text-[#1F4668]"
                        >
                          <span className="block text-sm font-bold sm:text-base">{website.name}</span>
                          <span className="mt-0.5 block truncate text-xs underline decoration-[#8CB8DC] underline-offset-2 sm:text-sm">
                            {website.url}
                          </span>
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            void navigator.clipboard?.writeText(website.url)
                            setCopiedWork(website.url)
                            window.setTimeout(() => setCopiedWork(null), 1600)
                          }}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#315D86] text-white transition hover:bg-[#244A6B]"
                          aria-label={`复制${website.name}网址`}
                          title={copiedWork === website.url ? '已复制' : '复制网址'}
                        >
                          {copiedWork === website.url ? (
                            <Check className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Copy className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : work.type === 'video' ? (
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
                {work.type !== 'link' && !loadedWorks[work.src] ? (
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
                {'description' in work && typeof work.description === 'string' ? <p className="mt-3 text-sm leading-relaxed text-[#5F5144]">{work.description}</p> : null}
              </div>
            </motion.article>
          ))}
        </div>
        <motion.article
          className="mt-6 overflow-hidden rounded-3xl border border-[#2F302F] bg-[#1E2222] shadow-[0_22px_70px_rgba(25,27,26,0.22)]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: works.length * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid gap-0 md:grid-cols-[minmax(220px,0.38fr)_minmax(0,0.62fr)]">
            <div className="relative min-h-[360px] bg-[#303535] md:min-h-[430px]">
              <img
                src={mistCityPosterSrc}
                alt="迷雾都城 · 上部-暗黑传说电影海报"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="flex flex-col justify-center p-6 text-[#F9EBC1] sm:p-8 md:p-10">
              <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#D7B66B]">AI 原创仿真人微电影作品</p>
              <h2 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                《迷雾都城 · 上部-暗黑传说》
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#D7D4C8] sm:text-base">
                一部以迷雾、古城与暗黑传说为核心意象的 AI 原创仿真人微电影作品。下载原片，完整观看这段发生在雾起之夜的故事。
              </p>
              <div className="mt-8">
                <a
                  href={mistCityMovieSrc}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-[#E6B85C] px-6 py-3 text-sm font-bold text-[#27231B] transition hover:-translate-y-0.5 hover:bg-[#F2CB7A]"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  下载电影原片
                </a>
              </div>
            </div>
          </div>
        </motion.article>
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
              <div className="mt-5 grid gap-2 rounded-2xl border border-[#E0CFB8] bg-[#FFF7EA] p-3 text-left shadow-[0_10px_28px_rgba(112,88,58,0.06)]">
                <div className="flex items-center gap-3 rounded-xl bg-white/55 px-3 py-2">
                  <MessageCircle className="h-4 w-4 shrink-0 text-[#8C633F]" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#9B8A78]">QQ</p>
                    <p className="break-all text-sm font-bold text-[#2B221A]">2467548120</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white/55 px-3 py-2">
                  <Mail className="h-4 w-4 shrink-0 text-[#8C633F]" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#9B8A78]">邮箱</p>
                    <p className="break-all text-sm font-bold text-[#2B221A]">2467548120@qq.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white/55 px-3 py-2">
                  <Clapperboard className="h-4 w-4 shrink-0 text-[#8C633F]" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#9B8A78]">抖音号</p>
                    <p className="break-all text-sm font-bold text-[#2B221A]">tianxiuyangy24</p>
                  </div>
                </div>
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
const MEASURED_BG_IMAGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260713_140344_79e1296a-86d7-43fd-9b5f-63ffe560f291.png&w=1280&q=85'
const MEASURED_FRONT_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260713_162101_0d7498c5-29bb-47bf-a99f-2773c0a880a9.mp4'
const MEASURED_OVERLAY_IMAGE = 'https://soft-zoom-63098134.figma.site/_assets/v11/3f10f1876e118f72a396e05a6c2d099569478272.png'
const CINEMATIC_SECRET_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4'
const LITHOS_BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85'
const LITHOS_BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85'
const SPOTLIGHT_R = 260

function CinematicSecretScene() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined
    void video.play().catch(() => {})
    return undefined
  }, [])

  const metadata = [
    { icon: Star, text: '8.7/10 IMDB', fill: true },
    { icon: Clock3, text: '132 min' },
    { icon: CalendarDays, text: '2026年7月20日' },
  ]

  return (
    <div className="relative h-screen overflow-hidden bg-black font-helvetica-neue text-white">
      <video
        ref={videoRef}
        className="fixed inset-0 z-0 h-full w-full object-cover"
        src={CINEMATIC_SECRET_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
      />
      <div
        className="pointer-events-none fixed inset-0 z-[1] backdrop-blur-xl"
        style={{
          maskImage: 'linear-gradient(to top, black 0%, transparent 45%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 45%)',
        }}
      />
      <div className="pointer-events-none relative z-10 flex h-screen flex-col justify-end px-4 pb-24 sm:px-6 md:px-12 md:pb-20">
        <div className="max-w-4xl">
          <div className="mb-6 flex flex-wrap gap-3 text-xs text-white sm:mb-8 sm:gap-6 sm:text-sm">
            {metadata.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={item.text} className="animate-blur-fade-up flex items-center gap-2" style={{ animationDelay: `${300 + index * 80}ms` }}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${item.fill ? 'fill-white' : ''}`} />
                  <span className="font-medium">{item.text}</span>
                </div>
              )
            })}
          </div>
          <h2
            className="animate-blur-fade-up mb-4 max-w-4xl text-3xl font-normal leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl"
            style={{ animationDelay: '540ms' }}
          >
            Step Through. Work Smarter.
          </h2>
          <p className="animate-blur-fade-up max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl" style={{ animationDelay: '680ms' }}>
            A voyage through forgotten realms, where past and future intertwine.
          </p>
        </div>
      </div>
    </div>
  )
}

function MeasuredSecretScene() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<SVGSVGElement>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = maskCanvasRef.current
    const reveal = revealRef.current
    const grid = gridRef.current
    const video = videoRef.current
    if (!section || !canvas || !reveal) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let width = 0
    let height = 0
    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let smoothX = targetX
    let smoothY = targetY
    let gridX = 0
    let gridY = 0
    let rafId = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width)
      canvas.height = Math.round(height)
    }

    const drawMask = () => {
      ctx.clearRect(0, 0, width, height)
      const gradient = ctx.createRadialGradient(smoothX, smoothY, 0, smoothX, smoothY, 260)
      gradient.addColorStop(0, 'rgba(255,255,255,1)')
      gradient.addColorStop(0.4, 'rgba(255,255,255,1)')
      gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)')
      gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)')
      gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      const maskImage = `url(${canvas.toDataURL('image/png')})`
      reveal.style.maskImage = maskImage
      reveal.style.webkitMaskImage = maskImage
    }

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
    }

    const tick = () => {
      smoothX += (targetX - smoothX) * 0.1
      smoothY += (targetY - smoothY) * 0.1
      drawMask()

      if (grid) {
        const nextGridX = ((smoothX - width / 2) / Math.max(width / 2, 1)) * 16
        const nextGridY = ((smoothY - height / 2) / Math.max(height / 2, 1)) * 16
        gridX += (nextGridX - gridX) * 0.06
        gridY += (nextGridY - gridY) * 0.06
        grid.style.transform = `translate3d(${gridX}px, ${gridY}px, 0)`
      }

      rafId = window.requestAnimationFrame(tick)
    }

    resize()
    void video?.play().catch(() => {})
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove)
    rafId = window.requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={sectionRef} className="font-helvetica-neue relative h-screen overflow-hidden bg-white text-white">
      <svg ref={gridRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-10" aria-hidden="true">
        <defs>
          <pattern id="measured-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#64748b" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#measured-grid)" />
      </svg>

      <div
        className="absolute inset-0 z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${MEASURED_BG_IMAGE})` }}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute left-0 right-0 top-20 z-20 flex justify-center px-4 sm:top-28 md:top-32">
        <h2 className="font-serif text-[4.5rem] uppercase leading-[0.9] text-white xs:text-[5.5rem] sm:text-[10rem] md:text-[13rem] lg:text-[16rem]">
          Measured
        </h2>
      </div>

      <img className="pointer-events-none absolute inset-0 z-[25] h-full w-full object-cover" src={MEASURED_OVERLAY_IMAGE} alt="" />

      <div ref={revealRef} className="absolute inset-0 z-30" style={{ clipPath: 'inset(40% 0 0 0)' }} aria-hidden="true">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={MEASURED_FRONT_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
        />
      </div>

      <canvas ref={maskCanvasRef} className="hidden" aria-hidden="true" />
    </div>
  )
}

function RevealLayer({ image, cursorX, cursorY }: { image: string; cursorX: number; cursorY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const reveal = revealRef.current
    if (!canvas || !reveal) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)')
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)')
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2)
    ctx.fill()

    const maskImage = `url(${canvas.toDataURL()})`
    reveal.style.maskImage = maskImage
    reveal.style.webkitMaskImage = maskImage
  })

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} aria-hidden="true" />
      <div
        ref={revealRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
        }}
        aria-hidden="true"
      />
    </>
  )
}

function LithosSecretScene() {
  const mouse = useRef({ x: -999, y: -999 })
  const smooth = useRef({ x: -999, y: -999 })
  const rafRef = useRef(0)
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      mouse.current = { x: event.clientX, y: event.clientY }
    }

    const tick = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1
      setCursorPos({ x: smooth.current.x, y: smooth.current.y })
      rafRef.current = window.requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMouseMove)
    rafRef.current = window.requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <section className="relative w-full overflow-hidden h-screen bg-black" style={{ height: '100dvh' }}>
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
          style={{ backgroundImage: `url(${LITHOS_BG_IMAGE_1})` }}
          aria-hidden="true"
        />
        <RevealLayer image={LITHOS_BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />
      </section>
    </div>
  )
}

function SecretSpacePage({ onBack }: { onBack: () => void }) {
  const [secretScene, setSecretScene] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoBgRef = useRef<HTMLDivElement>(null)
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
      }
      video.currentTime = 0
      void video.play().catch(() => {})
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
    if (secretScene !== 0) return undefined
    const video = videoRef.current
    if (!video) return undefined

    void video.play().catch(() => {})
    return undefined
  }, [secretScene])

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
      {secretScene === 0 ? (
        <>
          <div ref={videoBgRef} className="fixed -inset-[140px] z-0 origin-center">
        <video
          ref={videoRef}
          src={SECRET_VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className="h-full w-full object-cover"
          style={{ display: 'block' }}
        />
      </div>

          <div ref={butterflyLayerRef} className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true" />
        </>
      ) : null}
      {secretScene === 1 ? (
        <MeasuredSecretScene />
      ) : null}
      {secretScene === 2 ? (
        <CinematicSecretScene />
      ) : null}
      {secretScene === 3 ? (
        <LithosSecretScene />
      ) : null}

      <button
        type="button"
        onClick={() => setSecretScene((current) => (current + 1) % 4)}
        className="fixed right-[22px] top-1/2 z-[9999] flex h-12 -translate-y-1/2 items-center gap-2 rounded-full border border-white/45 bg-black/55 px-4 text-sm font-bold text-white shadow-[0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/75 active:scale-95 sm:right-[32px] sm:h-14 sm:px-5"
        aria-label="切换秘境空间场景"
      >
        <span className="whitespace-nowrap">切换场景</span>
        <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <button
        type="button"
        onClick={onBack}
        className="fixed right-[28px] top-[28px] z-[9999] flex h-12 items-center gap-2 rounded-full border border-white/55 bg-black/65 px-4 text-sm font-bold text-white shadow-[0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/80 active:scale-95 sm:right-[40px] sm:top-[32px] sm:h-14 sm:px-5"
        aria-label="返回首页"
      >
        <ArrowRight className="h-5 w-5 rotate-180 sm:h-6 sm:w-6" />
        <span className="whitespace-nowrap">返回主页</span>
      </button>
    </div>
  )
}

function App() {
  const [page, setPage] = useState<'home' | 'works' | 'details' | 'secret' | 'warehouse'>('home')

  if (page === 'works') {
    return <WorksPage onBack={() => setPage('home')} />
  }

  if (page === 'details') {
    return <DetailInfoPage onBack={() => setPage('home')} />
  }

  if (page === 'secret') {
    return <SecretSpacePage onBack={() => setPage('home')} />
  }

  if (page === 'warehouse') {
    return <WarehousePage onBack={() => setPage('home')} />
  }

  return (
    <main className="min-h-screen bg-[#F8F1E6] text-[#2B221A]">
      <Hero />
      <About onOpenSecret={() => setPage('secret')} onOpenWarehouse={() => setPage('warehouse')} />
      <PersonalInfo onOpenDetails={() => setPage('details')} />
      <Features onOpenWorks={() => setPage('works')} />
      <ImageLab />
      <MessageBoard />
    </main>
  )
}

export default App
