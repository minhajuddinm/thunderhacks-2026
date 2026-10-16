export const PRESENTATION_MINUTES_PER_TEAM = 15

export type AdminJudgingTeam = {
  team_id: string
  team_name: string
  campus: string | null
  members: string | null
  judging_enabled: boolean
}
