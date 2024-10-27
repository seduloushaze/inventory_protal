'use client'

import { useEffect, useState, useRef } from 'react'
import { Search, User, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Matter from 'matter-js'

const BackgroundGadget = ({ x, y, width, height, path }: { x: number; y: number; width: number; height: number; path: string }) => (
  <svg
    style={{
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`,
    }}
    viewBox="0 0 100 100"
  >
    <path d={path} fill="#ffffff" fillOpacity="0.1" />
  </svg>
)

export default function AnimatedDoraemonItemsPage() {
  const [items, setItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState([])
  const [studentName, setStudentName] = useState('')
  const sceneRef = useRef(null)
  const engineRef = useRef(null)

  // Hardcoded data
  const name = "Nobita Nobi"
  const hardcodedItems = [
    {
      id: 1,
      name: "Anywhere Door",
      description: "Teleport to any location you desire!",
      quantityTotal: "10",
      quantityAvailable: "5",
      image: "https://miro.medium.com/v2/resize:fit:584/1*_MjjGLbH2jAY_6X8WxrMFA.png"
    },
    {
      id: 2,
      name: "Time Machine",
      description: "Travel through time with ease!",
      quantityTotal: "20",
      quantityAvailable: "10",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXoVwZmQnGTnAbXUigEb539kPb10TOaMH3pw&s"
    },
    {
      id: 3,
      name: "Bamboo Copter",
      description: "Fly through the sky with this amazing gadget!",
      quantityTotal: "15",
      quantityAvailable: "7",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTah-L4QzoAcqGvBZQ-BEyrcEezADFYnnKCfA&s"
    },
    {
      id: 4,
      name: "Translation Konjac",
      description: "Understand any language instantly!",
      quantityTotal: "25",
      quantityAvailable: "12",
      image: "https://static.wikia.nocookie.net/doraemon/images/7/7e/Konyaku.jpg"
    }
  ]

  const gadgetPaths = [
    "M10 50 H90 M50 10 V90",
    "M10 10 H90 V90 H10 Z",
    "M50 10 L90 50 L50 90 L10 50 Z",
    "M10 50 Q50 10 90 50 Q50 90 10 50"
  ]

  useEffect(() => {
    setStudentName(name)
    setItems(hardcodedItems)
    setFilteredItems(hardcodedItems)

    // Set up Matter.js
    const Engine = Matter.Engine
    const Render = Matter.Render
    const World = Matter.World
    const Bodies = Matter.Bodies

    engineRef.current = Engine.create()

    const render = Render.create({
      element: sceneRef.current,
      engine: engineRef.current,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent'
      }
    })

    const gadgets = gadgetPaths.map((path, index) => {
      return Bodies.circle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        30,
        {
          render: {
            fillStyle: 'transparent'
          },
          label: `gadget-${index}`
        }
      )
    })

    World.add(engineRef.current.world, gadgets)

    Engine.run(engineRef.current)
    Render.run(render)

    // Handle window resize
    const handleResize = () => {
      render.canvas.width = window.innerWidth
      render.canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // Handle scroll
    const handleScroll = () => {
      const scrollY = window.scrollY
      Matter.Body.translate(engineRef.current.world.bodies[0], { x: 0, y: scrollY * 0.1 })
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      Render.stop(render)
      World.clear(engineRef.current.world)
      Engine.clear(engineRef.current)
      render.canvas.remove()
      render.canvas = null
      render.context = null
      render.textures = {}
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    setFilteredItems(
      items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [searchQuery, items])

  return (
    <div className="min-h-screen bg-blue-500 relative overflow-hidden">
      <div ref={sceneRef} className="absolute inset-0" />
      <div className="container mx-auto p-4 relative z-10">
        <header className="flex justify-between items-center mb-6 p-4 bg-white bg-opacity-90 shadow-md rounded-lg border-4 border-blue-300">
          <div className="flex items-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <img
                src="https://image.pngaaa.com/436/4948436-middle.png"
                alt="Doraemon"
                width={50}
                height={50}
                className="mr-4"
              />
            </motion.div>
            <h1 className="text-3xl font-bold text-blue-700">Welcome, {studentName}-kun!</h1>
          </div>
          <motion.button 
            className="bg-yellow-400 text-blue-700 py-2 px-6 rounded-full hover:bg-yellow-500 transition duration-200 flex items-center"
            onClick={() => window.location.href = '/profile'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="mr-2" />
            Your Gadgets
          </motion.button>
        </header>

        {/* Doraemon's 4D Pocket (Search Bar) */}
        <div className="mb-8 relative">
          <input
            type="text"
            className="border-4 border-blue-300 p-3 w-full rounded-full shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 pl-12 bg-white bg-opacity-90"
            placeholder="Search Doraemon's 4D Pocket..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
        </div>

        {/* Gadget List */}
        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {filteredItems.map(item => (
              <motion.div 
                key={item.id} 
                className="bg-white bg-opacity-90 shadow-lg rounded-2xl p-6 hover:shadow-xl transition duration-300 border-4 border-blue-300 hover:border-blue-500"
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                }}
                whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative w-full h-48 mb-4">
                  <img src={item.image} alt={item.name} layout="fill" objectFit="cover" className="rounded-t-lg" />
                </div>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">{item.name}</h2>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <p className="text-blue-900 font-semibold mb-4">Available: {item.quantityAvailable}</p>
                <motion.button 
                  className="bg-yellow-400 text-blue-700 py-2 px-6 rounded-full hover:bg-yellow-500 transition duration-200 w-full font-bold"
                  onClick={() => window.location.href = `/items/${item.id}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Use Gadget
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="mt-12 flex justify-center space-x-4">
          <motion.button 
            className="bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition duration-200 flex items-center"
            onClick={() => window.location.href = '/items/all'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <Package className="mr-2" />
            All Gadgets
          </motion.button>
          <motion.button 
            className="bg-green-500 text-white py-3 px-6 rounded-full hover:bg-green-600 transition duration-200 flex items-center"
            onClick={() => window.location.href = '/items/available'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <Package className="mr-2" />
            Available Gadgets
          </motion.button>
        </div>
      </div>
    </div>
  )
}