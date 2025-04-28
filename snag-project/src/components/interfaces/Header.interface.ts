export interface HeaderProps {
  /**
   * Optional className for custom styling
   */
  className?: string;

  /**
   * Optional callback for when the menu is toggled
   */
  onMenuToggle?: (isOpen: boolean) => void;
}

export interface HeaderState {
  isMenuOpen: boolean;
  isScrolled: boolean;
}
