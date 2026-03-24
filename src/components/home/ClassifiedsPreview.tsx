'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useBreakpoint } from '@/hooks/useBreakpoint'

const TABS = ['For Sale', 'Free'] as const
type Tab = typeof TABS[number]

interface ClassifiedItem {
  id: number
  cat: Tab
  title: string
  price: string
  originalPrice?: string
  discount?: string
  location: string
  date: string
  image: string
}

const MOCK_ITEMS: ClassifiedItem[] = [
  // ── For Sale (18) ──────────────────────────────────────────────────────────
  { id:  1, cat: 'For Sale', title: '2022 Trek FX3 Disc Hybrid Bike — Excellent Condition',      price: '$850',   originalPrice: '$1,200', discount: '29%', location: 'Steinbach', date: 'Today',  image: '/classifieds/forsale-01-bike.jpg'        },
  { id:  2, cat: 'For Sale', title: 'iPhone 15 Pro Max 256GB — Like New, Space Black',            price: '$1,100', originalPrice: '$1,399', discount: '21%', location: 'Steinbach', date: 'Today',  image: '/classifieds/forsale-02-iphone.jpg'      },
  { id:  3, cat: 'For Sale', title: 'Sectional Sofa — Charcoal Gray, Like New',                   price: '$650',                                            location: 'Mitchell',  date: 'Mar 19', image: '/classifieds/forsale-03-sofa.jpg'        },
  { id:  4, cat: 'For Sale', title: 'LG 55" OLED 4K Smart TV — Model C2 Series',                 price: '$800',   originalPrice: '$1,200', discount: '33%', location: 'Steinbach', date: 'Mar 18', image: '/classifieds/forsale-04-tv.jpg'          },
  { id:  5, cat: 'For Sale', title: 'Husqvarna 24" Two-Stage Snowblower — Runs Great',            price: '$1,200', originalPrice: '$1,600', discount: '25%', location: 'Grunthal',  date: 'Mar 17', image: '/classifieds/forsale-05-snowblower.jpg'  },
  { id:  6, cat: 'For Sale', title: 'John Deere X350 Riding Lawnmower — 42" Deck',                price: '$3,200',                                            location: 'Steinbach', date: 'Mar 16', image: '/classifieds/forsale-06-mower.jpg'       },
  { id:  7, cat: 'For Sale', title: 'Gaming PC — RTX 4070, Ryzen 9, 32GB RAM, 2TB SSD',          price: '$2,400', originalPrice: '$3,200', discount: '25%', location: 'Steinbach', date: 'Mar 15', image: '/classifieds/forsale-07-pc.jpg'          },
  { id:  8, cat: 'For Sale', title: 'KitchenAid Artisan Stand Mixer — Cherry Red, Lightly Used',  price: '$280',   originalPrice: '$550',   discount: '49%', location: 'Steinbach', date: 'Mar 14', image: '/classifieds/forsale-08-mixer.jpg'       },
  { id:  9, cat: 'For Sale', title: 'Baby Stroller — Chicco Bravo, Grey, Excellent Condition',    price: '$180',                                            location: 'Mitchell',  date: 'Mar 13', image: '/classifieds/forsale-09-stroller.jpg'    },
  { id: 10, cat: 'For Sale', title: 'Golf Club Set — Callaway 14-Piece, Men\'s Right Hand',       price: '$550',   originalPrice: '$900',   discount: '39%', location: 'Grunthal',  date: 'Mar 12', image: '/classifieds/forsale-10-golf.jpg'        },
  { id: 11, cat: 'For Sale', title: 'Fender Stratocaster Electric Guitar — Sunburst, Hardcase',   price: '$700',   originalPrice: '$1,200', discount: '42%', location: 'Steinbach', date: 'Mar 11', image: '/classifieds/forsale-11-guitar.jpg'      },
  { id: 12, cat: 'For Sale', title: 'NordicTrack Treadmill T 6.5 S — Foldable, Works Great',      price: '$450',   originalPrice: '$1,200', discount: '63%', location: 'Steinbach', date: 'Mar 10', image: '/classifieds/forsale-12-treadmill.jpg'   },
  { id: 13, cat: 'For Sale', title: 'PlayStation 5 Disc Edition + 2 Controllers + 5 Games',       price: '$650',   originalPrice: '$850',   discount: '24%', location: 'Steinbach', date: 'Mar 9',  image: '/classifieds/forsale-13-ps5.jpg'         },
  { id: 14, cat: 'For Sale', title: 'Winter Tires — 235/65R17 Michelin X-Ice, Set of 4',          price: '$480',   originalPrice: '$700',   discount: '31%', location: 'Mitchell',  date: 'Mar 8',  image: '/classifieds/forsale-14-tires.jpg'       },
  { id: 15, cat: 'For Sale', title: '14ft Pelican Kayak — Paddles Included, Barely Used',         price: '$900',                                            location: 'Grunthal',  date: 'Mar 7',  image: '/classifieds/forsale-15-kayak.jpg'       },
  { id: 16, cat: 'For Sale', title: 'Weber Original Kettle BBQ — 22", Excellent Condition',       price: '$160',   originalPrice: '$300',   discount: '47%', location: 'Steinbach', date: 'Mar 6',  image: '/classifieds/forsale-16-bbq.jpg'         },
  { id: 17, cat: 'For Sale', title: 'Solid Wood Dining Table + 4 Chairs — Farmhouse Style',       price: '$420',                                            location: 'Steinbach', date: 'Mar 5',  image: '/classifieds/forsale-17-diningtable.jpg' },
  { id: 18, cat: 'For Sale', title: 'NordicTrack Elliptical SE7i — Works Perfectly, Pickup Only', price: '$380',   originalPrice: '$900',   discount: '58%', location: 'Steinbach', date: 'Mar 4',  image: '/classifieds/forsale-18-elliptical.jpg'  },

  // ── Free (18) ──────────────────────────────────────────────────────────────
  { id: 19, cat: 'Free', title: 'Moving Boxes — Various Sizes, Clean & Sturdy',               price: 'FREE', location: 'Steinbach', date: 'Today',  image: '/classifieds/free-01-boxes.jpg'      },
  { id: 20, cat: 'Free', title: 'Firewood — Split & Dried, Must Pick Up',                     price: 'FREE', location: 'Grunthal',  date: 'Today',  image: '/classifieds/free-02-firewood.jpg'   },
  { id: 21, cat: 'Free', title: 'Garden Soil & Compost Bags — 8 Bags Available',              price: 'FREE', location: 'Steinbach', date: 'Mar 19', image: '/classifieds/free-03-soil.jpg'       },
  { id: 22, cat: 'Free', title: "Kids' Toys — Assorted Plastic Toys & Stuffed Animals",       price: 'FREE', location: 'Mitchell',  date: 'Mar 18', image: '/classifieds/free-04-toys.jpg'       },
  { id: 23, cat: 'Free', title: 'Leftover Paint Cans — Various Colors, Half Full',            price: 'FREE', location: 'Steinbach', date: 'Mar 17', image: '/classifieds/free-05-paint.jpg'      },
  { id: 24, cat: 'Free', title: 'Potted Houseplants — Spider Plants & Pothos, 6 Available',   price: 'FREE', location: 'Steinbach', date: 'Mar 16', image: '/classifieds/free-06-plants.jpg'     },
  { id: 25, cat: 'Free', title: 'Lumber & Wood Planks — Assorted Sizes, Garage Cleanout',    price: 'FREE', location: 'Steinbach', date: 'Mar 15', image: '/classifieds/free-07-lumber.jpg'     },
  { id: 26, cat: 'Free', title: 'Terracotta Flower Pots — Various Sizes, 20+ Available',     price: 'FREE', location: 'Mitchell',  date: 'Mar 14', image: '/classifieds/free-08-pots.jpg'       },
  { id: 27, cat: 'Free', title: 'Used Paperback Books & Magazines — Box of 40+',              price: 'FREE', location: 'Steinbach', date: 'Mar 13', image: '/classifieds/free-09-books.jpg'      },
  { id: 28, cat: 'Free', title: 'Baby Clothes — Newborn to 12M, All Clean, Box of 30+',      price: 'FREE', location: 'Grunthal',  date: 'Mar 12', image: '/classifieds/free-10-babyclothes.jpg'},
  { id: 29, cat: 'Free', title: 'Old Microwave — Works Fine, Just Upgrading',                 price: 'FREE', location: 'Steinbach', date: 'Mar 11', image: '/classifieds/free-11-microwave.jpg'  },
  { id: 30, cat: 'Free', title: 'Concrete Patio Stones — 20+ Pieces, Must Take All',         price: 'FREE', location: 'Steinbach', date: 'Mar 10', image: '/classifieds/free-12-patiostones.jpg'},
  { id: 31, cat: 'Free', title: 'Rolled Sod — Fresh Cut, About 30 Rolls, Pickup Today',      price: 'FREE', location: 'Mitchell',  date: 'Mar 9',  image: '/classifieds/free-13-sod.jpg'        },
  { id: 32, cat: 'Free', title: 'Christmas Decorations — Box of Ornaments, Lights & Tinsel', price: 'FREE', location: 'Steinbach', date: 'Mar 8',  image: '/classifieds/free-14-xmasdeco.jpg'   },
  { id: 33, cat: 'Free', title: 'Garden Hose + Hand Tools — Old but Working',                 price: 'FREE', location: 'Grunthal',  date: 'Mar 7',  image: '/classifieds/free-15-gardenhose.jpg' },
  { id: 34, cat: 'Free', title: 'Gravel & Landscaping Stones — Pile in Driveway, Free Pickup', price: 'FREE', location: 'Steinbach', date: 'Mar 6', image: '/classifieds/free-16-gravel.jpg'     },
  { id: 35, cat: 'Free', title: 'Wooden Bookshelves — 2 Units, Solid Wood, Some Wear',       price: 'FREE', location: 'Steinbach', date: 'Mar 5',  image: '/classifieds/free-17-shelves.jpg'    },
  { id: 36, cat: 'Free', title: 'Moving Blankets & Padding — 10+ Pieces, Garage Cleanout',   price: 'FREE', location: 'Mitchell',  date: 'Mar 4',  image: '/classifieds/free-18-blankets.jpg'   },

]

export default function ClassifiedsPreview() {
  const { width } = useBreakpoint()
  // 대형 태블릿(981~1199): 6개 / 소형 태블릿 이하(≤980): 4개 / 데스크탑: 6개
  const itemsPerPage = width >= 981 && width < 1200 ? 6 : width < 981 ? 4 : 6

  const [activeTab, setActiveTab] = useState<Tab>('For Sale')
  const [page, setPage] = useState(0)

  const filtered = MOCK_ITEMS.filter(item => item.cat === activeTab)
  const totalPages = Math.floor(filtered.length / itemsPerPage)
  const items = filtered.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

  function handleTabChange(tab: Tab) {
    setActiveTab(tab)
    setPage(0)
  }

  return (
    <div className="classifieds-preview panel">

      {/* ── Header ── */}
      <div className="panel__header">
        <Link href="/classifieds" className="panel__title-wrap">
          <div className="panel__icon" aria-hidden="true">
            <img src="/ico-shopping.svg" width={40} height={40} alt="" />
          </div>
          <span className="panel__title-link">
            Buy &amp; Sell
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" >
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </Link>
        <div className="classifieds-preview__tabs" role="tablist" aria-label="Classifieds categories">
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls="classifieds-tabpanel"
              className={`classifieds-preview__tab${activeTab === tab ? ' classifieds-preview__tab--active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Card grid: 2-col × 3-row ── */}
      <div id="classifieds-tabpanel" role="tabpanel" aria-label={activeTab} className="classifieds-preview__grid">
        {items.map(item => (
          <Link key={item.id} href={`/classifieds/${item.id}`} className="classifieds-preview__card">
            <div className="classifieds-preview__thumb">
              <Image src={item.image} alt={item.title} width={162} height={108} loading="lazy" />
            </div>
            <div className="classifieds-preview__info">
              <span className="classifieds-preview__card-title">{item.title}</span>
              <div className="classifieds-preview__card-price">
                {item.originalPrice && (
                  <span className="classifieds-preview__card-price-original">{item.originalPrice}</span>
                )}
                <span className="classifieds-preview__card-price-current">
                  {item.discount && (
                    <span className="classifieds-preview__card-price-discount">{item.discount}</span>
                  )}
                  {item.price}
                </span>
              </div>
              <span className="classifieds-preview__card-meta">{item.location} · {item.date}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="classifieds-preview__footer">
        <button
          type="button"
          className="classifieds-preview__footer-btn"
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          aria-label="Previous page"
        >
          <svg aria-hidden="true" width="8" height="14" viewBox="0 0 8 14" fill="none" >
            <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="classifieds-preview__footer-label">
          <span className="classifieds-preview__footer-more">Buy &amp; Sell More</span>
          <span className="classifieds-preview__footer-page">{page + 1}/{totalPages}</span>
        </div>
        <button
          type="button"
          className="classifieds-preview__footer-btn"
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          aria-label="Next page"
        >
          <svg aria-hidden="true" width="8" height="14" viewBox="0 0 8 14" fill="none" >
            <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

    </div>
  )
}
