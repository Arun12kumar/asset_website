"use client";

import React from 'react'
import CategoryTable from './CategoryTable';
import AddCategory from './AddCategory';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { CategoryProvider, useCategoryContext } from '@/context/CategoryProvider';
import EditCategory from './EditCategory';

const CategoryPageContent = () => {
  const { setOpen } = useCategoryContext();

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl text-black/80 font-bold">
          Category Management
        </h1>
        <Button
          onClick={() => setOpen(true)}
          className="bg-blue-500 hover:bg-blue-500/80 transition delay-75 duration-300 ease-in-out cursor-pointer"
        >
          Add <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Add category Table */}
      <CategoryTable/>
      {/* <AddCategory /> */}
      <AddCategory/>
      {/* edit Page */}
      <EditCategory/>
    </>
  );
}

const CategoryPage = () => (
  <CategoryProvider>
    <CategoryPageContent />
  </CategoryProvider>
);

export default CategoryPage