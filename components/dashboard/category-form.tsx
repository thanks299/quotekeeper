"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryFormProps {
  categories: string[]
  onAddCategory: (name: string) => Promise<void>
}

export function CategoryForm({ categories, onAddCategory }: CategoryFormProps) {
  const [newCategoryName, setNewCategoryName] = useState("")

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === "" || categories.includes(newCategoryName.toLowerCase())) return

    await onAddCategory(newCategoryName.toLowerCase())
    setNewCategoryName("")
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-category">Add New Category</Label>
              <div className="flex gap-2">
                <Input
                  id="new-category"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="transition-all duration-200 focus:ring-primary"
                />
                <Button
                  onClick={handleAddCategory}
                  disabled={newCategoryName.trim() === ""}
                  className="transition-all duration-200 hover:scale-105 bg-gradient-to-r from-secondary to-terracotta-light"
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Current Categories</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <motion.div
                    key={category}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

