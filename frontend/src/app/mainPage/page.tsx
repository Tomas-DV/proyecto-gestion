'use client';

import { useState } from 'react';
import {
  Box,
} from '@chakra-ui/react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SectionContent from '@/components/sections/SectionContent';
import { useColorModeValue } from '@/components/ui/color-mode';

const MainPage = () => {
  const [currentSection, setCurrentSection] = useState('dashboard');
  
  // Fondo adaptativo para modo claro/oscuro
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Sidebar */}
      <Sidebar 
        onSectionChange={handleSectionChange} 
        currentSection={currentSection}
      />
      
      {/* Header */}
      <Header 
        currentSection={currentSection} 
        onSectionChange={handleSectionChange}
      />
      
      {/* Main Content */}
      <Box
        ml="300px"
        mt="60px"
        p={6}
        minH="calc(100vh - 60px)"
      >
        <SectionContent section={currentSection} onSectionChange={handleSectionChange} />
      </Box>
    </Box>
  );
};

export default MainPage;
