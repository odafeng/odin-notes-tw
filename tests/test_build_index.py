"""build_index 的單元測試：frontmatter 解析、課程排序、進度區渲染。"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))

import build_index as bi  # noqa: E402


def _lec(title: str, course: str, order: int, rel_url: str) -> bi.Lecture:
    return bi.Lecture(
        title=title,
        path="foundations",
        course=course,
        order=order,
        rel_url=rel_url,
    )


def test_parse_frontmatter_reads_yaml(tmp_path: Path) -> None:
    md = tmp_path / "01-x.md"
    md.write_text(
        "---\ntitle: 測試\ncourse: Foundations\norder: 3\n---\n\n# 測試\n",
        encoding="utf-8",
    )
    fm = bi.parse_frontmatter(md)
    assert fm is not None
    assert fm["title"] == "測試"
    assert fm["course"] == "Foundations"
    assert fm["order"] == 3


def test_parse_frontmatter_without_frontmatter_returns_none(tmp_path: Path) -> None:
    md = tmp_path / "plain.md"
    md.write_text("# 沒有 frontmatter\n", encoding="utf-8")
    assert bi.parse_frontmatter(md) is None


def test_course_rank_follows_curriculum_order() -> None:
    assert bi.course_rank("Foundations") == 0
    assert bi.course_rank("JavaScript") == 2
    assert bi.course_rank("Getting Hired") == len(bi.COURSE_ORDER) - 1
    # 未知課程排最後
    assert bi.course_rank("Nonexistent") == len(bi.COURSE_ORDER)


def test_render_empty_returns_placeholder() -> None:
    assert bi.render([]) == "（課程目錄整理中。）"


def test_render_has_live_counter_and_plain_links() -> None:
    out = bi.render(
        [
            _lec("甲", "Foundations", 1, "a.md"),
            _lec("乙", "Foundations", 2, "b.md"),
        ]
    )
    # 讀者視角的即時計數容器（由前端 JS 依 localStorage 填）
    assert 'class="od-read-count"' in out
    assert 'data-total="2"' in out
    # 課目為純連結，不含建置期的 ✅/📖 狀態符號
    assert "- [甲](a.md)" in out
    assert "✅" not in out and "📖" not in out
    # 不含產線用語
    assert "已產" not in out


def test_render_groups_by_course_in_curriculum_order() -> None:
    out = bi.render(
        [
            _lec("j", "JavaScript", 1, "j.md"),
            _lec("f", "Foundations", 1, "f.md"),
        ]
    )
    # 每門課包成可摺疊 details，且 Foundations 排在 JavaScript 之前（依學習路線）
    assert "<details" in out and "od-course-progress" in out
    assert out.index("<summary>Foundations") < out.index("<summary>JavaScript")
