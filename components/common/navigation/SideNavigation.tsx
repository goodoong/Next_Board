import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import styles from "./SideNavigation.module.scss";
import { Search } from "lucide-react";

function SideNavigation() {
  return (
    <div className={styles.container}>
      {/* 검색창 */}
      <div className={styles.container__searchBox}>
          <Input
            type="text"
            placeholder="검색어를 입력해주세요"
            className="focust-visible:ring-0"
          />
        <Button variant={"outline"} size="icon">
          <Search className="w-4 h-4" />
        </Button>
      </div>
      <div className={styles.container__buttonBox}>
        <Button variant={"outline"} className="w-full text-emerald-500 border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600">
            Add New Page
        </Button>
      </div>
      <div className={styles.container__todos}>
    <span className={styles.container__todos_label}>Your To do</span>
      </div>
    </div>
  );
}

export default SideNavigation;
