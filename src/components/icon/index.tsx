import { Icon } from "@iconify/react";

interface PropsIcons {
  width?: number | string;
  color?: string;
}

const defaultProps = {
  width: 25,
  color: "#45556c",
};

 const UserLoginIcon = (props: PropsIcons) => (
  <Icon icon="mdi:account" {...defaultProps} {...props} />
);

 const PasswordIcon = (props: PropsIcons) => (
  <Icon icon="mdi:password" {...defaultProps} {...props} />
);

 const CompanyIcon = (props: PropsIcons) => (
  <Icon icon="mdi:company" {...defaultProps} {...props} />
);

const ReportDailyIcon = (props: PropsIcons) => (
  <Icon icon="mdi:clipboard-text-history" {...defaultProps} {...props} />
);

const ClasificationProductIcon = (props: PropsIcons) => (
  <Icon icon="mdi:receipt-text-arrow-left" {...defaultProps} {...props} />
);

const ProcessUCIcon = (props: PropsIcons) => (
  <Icon icon="mdi:ballot" {...defaultProps} {...props} />
);

const StorageIcon = (props: PropsIcons) => (
  <Icon icon="mdi:warehouse" {...defaultProps} {...props} />
);

const GradualStorageIcon = (props: PropsIcons) => (
  <Icon icon="mdi:freezing-point" {...defaultProps} {...props} />
);

const CheckListIcon  = (props: PropsIcons) => (
  <Icon icon="mdi:clipboard-list" {...defaultProps} {...props} />
);
export {
  UserLoginIcon,
  PasswordIcon,
  CompanyIcon,
  ReportDailyIcon,
  ClasificationProductIcon,
  ProcessUCIcon,
  StorageIcon,
  GradualStorageIcon,
  CheckListIcon
}