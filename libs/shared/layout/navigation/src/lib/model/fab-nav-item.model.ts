import { IconType } from "@ikigaidev/icon"
import { ThemeColor } from "@ikigaidev/model";

export type FabNavItem = {
    icon: IconType;
    iconSize: number;
    iconColor: ThemeColor;
    routerLink: string;
}