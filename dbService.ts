// //import { Pool } from 'pg'; // Usando PostgreSQL como ejemplo

// class DBService {
//     private pool: Pool;

//     constructor() {
//         this.pool = new Pool({
//             user: 'tu_usuario',
//             host: 'localhost',
//             database: 'tu_base_de_datos',
//             password: 'tu_contraseña',
//             port: 5432, // Cambia el puerto si es necesario
//         });
//     }

//     async login(username: string, password: string): Promise<any> {
//         try {
//             const query = 'SELECT * FROM usuarios WHERE username = $1 AND password = $2';
//             const values = [username, password];
//             const result = await this.pool.query(query, values);
//             return result.rows[0] || null;
//         } catch (error) {
//             console.error('Error en el inicio de sesión:', error);
//             throw error;
//         }
//     }

//     async query(sql: string, params: any[] = []): Promise<any> {
//         try {
//             const result = await this.pool.query(sql, params);
//             return result.rows;
//         } catch (error) {
//             console.error('Error en la consulta:', error);
//             throw error;
//         }
//     }

//     async close(): Promise<void> {
//         await this.pool.end();
//     }
// }

// export default new DBService();
