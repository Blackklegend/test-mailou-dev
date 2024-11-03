import {ColumnDefinitions, MigrationBuilder, PgLiteral} from "node-pg-migrate"

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createExtension("uuid-ossp", {
		ifNotExists: true,
		schema: "public",
	})

	pgm.createTable(
		"products",
		{
			id: {
				type: "uuid",
				primaryKey: true,
				default: new PgLiteral("uuid_generate_v4()"),
				notNull: true,
			},
			name: {type: "varchar(255)", notNull: true},
			description: {type: "text"},
			category: {type: "varchar(50)", notNull: true},
			price: {type: "numeric(10,2)", notNull: true},
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("current_timestamp"),
			},
		},
		{
			ifNotExists: true,
		},
	)

	pgm.createIndex("products", "category")
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("products")
}
