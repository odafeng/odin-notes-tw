"""掃描 docs/ 下所有講義的 frontmatter，重寫首頁的進度區塊。"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from pathlib import Path

import yaml

DOCS = Path(__file__).resolve().parent.parent / "docs"
INDEX = DOCS / "index.md"
START, END = "<!-- PROGRESS:START -->", "<!-- PROGRESS:END -->"

# 課程依 TOP 學習路線順序排列（首頁目錄用），而非字母序。
COURSE_ORDER = [
    "Foundations",
    "Intermediate HTML and CSS",
    "JavaScript",
    "Advanced HTML and CSS",
    "React",
    "Databases",
    "NodeJS",
    "Getting Hired",
]


def course_rank(course: str) -> int:
    return COURSE_ORDER.index(course) if course in COURSE_ORDER else len(COURSE_ORDER)


@dataclass
class Lecture:
    title: str
    path: str
    course: str
    order: int
    status: str
    rel_url: str


def parse_frontmatter(md: Path) -> dict | None:
    text = md.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return None
    end = text.find("\n---", 3)
    if end == -1:
        return None
    data = yaml.safe_load(text[3:end])
    return data if isinstance(data, dict) else None


def collect() -> list[Lecture]:
    lectures: list[Lecture] = []
    for md in sorted(DOCS.rglob("*.md")):
        if md.name == "index.md" or "about" in md.parts:
            continue
        fm = parse_frontmatter(md)
        if not fm or "course" not in fm:
            continue
        lectures.append(
            Lecture(
                title=str(fm.get("title", md.stem)),
                path=str(fm.get("path", "")),
                course=str(fm["course"]),
                order=int(fm.get("order", 0)),
                status=str(fm.get("status", "draft")),
                rel_url=md.relative_to(DOCS).as_posix(),
            )
        )
    lectures.sort(key=lambda lec: (course_rank(lec.course), lec.order))
    return lectures


def render(lectures: list[Lecture]) -> str:
    if not lectures:
        return "（課程目錄整理中。）"
    done = sum(1 for lec in lectures if lec.status == "done")
    lines = [
        f"已讀 {done}／{len(lectures)} 課 · 更新於 {date.today().isoformat()}",
        "",
        "✅ 已讀　📖 待讀",
        "",
    ]
    current = ""
    for lec in lectures:
        if lec.course != current:
            current = lec.course
            lines += [f"### {current}", ""]
        mark = "✅" if lec.status == "done" else "📖"
        lines.append(f"- {mark} [{lec.title}]({lec.rel_url})")
    return "\n".join(lines)


def main() -> None:
    text = INDEX.read_text(encoding="utf-8")
    head, rest = text.split(START, 1)
    _, tail = rest.split(END, 1)
    INDEX.write_text(
        f"{head}{START}\n{render(collect())}\n{END}{tail}", encoding="utf-8"
    )
    print(f"更新 {INDEX.relative_to(DOCS.parent)}")


if __name__ == "__main__":
    main()
